// External npm packages
import twilio from 'twilio';
import dotenv from 'dotenv';
import { WorkspaceInstance } from 'twilio/lib/rest/taskrouter/v1/workspace';
import { TaskQueueInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue';
import { WorkflowInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/workflow';

// Local imports
import { log } from '../../../src/lib/utils/logger';
import { updateEnvFile } from '../helpers/updateEnvFile';

export async function createTaskRouterService(client: any): Promise<{
  workspace: WorkspaceInstance | null;
  taskQueue: TaskQueueInstance | null;
  workflow: WorkflowInstance | null;
}> {
  dotenv.config();
  const serviceName = process.env.SERVICE_NAME;

  try {
    // Step 1: Check if a workspace already exists
    const workspaceName = `${serviceName} TaskRouter Workspace`;
    let workSpace: WorkspaceInstance | null = null;
    const workspaces = await client.taskrouter.v1.workspaces.list({ limit: 1 });

    if (workspaces.length > 0) {
      workSpace = workspaces[0];
      log.info({
        label: 'createTaskRouter',
        message: 'Existing workspace found',
        data: workSpace?.sid,
      });
    } else {
      // Create a new TaskRouter Workspace if none exists
      workSpace = await client.taskrouter.v1.workspaces.create({
        friendlyName: workspaceName,
      });
      log.green({
        label: 'createTaskRouter',
        message: 'New workspace created',
        data: workSpace?.sid,
      });
    }

    // Step 2: Check if a Task Queue with the same name already exists
    const taskQueueName = `${serviceName} Task Queue`;
    let taskQueue: TaskQueueInstance | null = null;
    const taskQueues = await client.taskrouter.v1
      .workspaces(workSpace?.sid || '')
      .taskQueues.list();

    if (taskQueues.length > 0) {
      // If a queue exists with the exact name, use it
      taskQueue = taskQueues.find(
        (queue: any) => queue.friendlyName === taskQueueName
      )!;
      if (taskQueue) {
        log.info({
          label: 'createTaskRouter',
          message: 'Existing Task Queue found',
          data: taskQueue.sid,
        });
      }
    }
    // If no task queue with the name exists, create a new one
    if (!taskQueue) {
      taskQueue = await client.taskrouter.v1
        .workspaces(workSpace?.sid || '')
        .taskQueues.create({
          friendlyName: taskQueueName,
          reservationActivitySid: workSpace?.defaultActivitySid || '',
          assignmentActivitySid: workSpace?.defaultActivitySid || '',
        });
              log.green({
          label: 'createTaskRouter',
          message: 'New Task Queue created',
          data: taskQueue?.sid,
        });
    }

    // Step 3: Check if a Workflow with the same name already exists
    const workflowName = `${serviceName} Workflow`;
    let workflow: WorkflowInstance | null = null;
    const workflows = await client.taskrouter.v1
      .workspaces(workSpace?.sid || '')
      .workflows.list();

    if (workflows.length > 0) {
      // If a workflow exists with the exact name, use it
      workflow = workflows.find((wf: any) => wf.friendlyName === workflowName)!;
      if (workflow) {
        log.info({
          label: 'createTaskRouter',
          message: 'Existing Workflow found',
          data: workflow.sid,
        });
        // Update the existing workflow to support simple worker targeting (demo mode)
        workflow = await client.taskrouter.v1
          .workspaces(workSpace?.sid || '')
          .workflows(workflow?.sid || '')
          .update({
            configuration: JSON.stringify({
              task_routing: {
                filters: [
                  {
                    // Route to specific worker when targetWorker is specified, with failover
                    filter_friendly_name:
                      'Specific Worker Filter with Failover',
                    expression: 'targetWorker != null',
                    targets: [
                      {
                        // First target: Try to route to the specific worker with priority
                        queue: taskQueue?.sid || '',
                        expression: `worker.friendly_name == task.targetWorker`,
                        timeout: 1, // Wait 1 second for the specific worker
                      },
                      {
                        // Second target: Failover to any available worker
                        queue: taskQueue?.sid || '',
                        // No expression means any available worker in the queue
                      },
                    ],
                  },
                ],
                default_filter: {
                  queue: taskQueue?.sid || '', // Route to any available agent when no targetWorker specified
                },
              },
            }),
          });
        log.green({
          label: 'createTaskRouter',
          message: 'Updated existing Workflow with failover',
          data: workflow?.sid,
        });
      }
    }
    if (!workflow) {
      // If no workflow with the name exists, create a new one
      workflow = await client.taskrouter.v1
        .workspaces(workSpace?.sid || '')
        .workflows.create({
          friendlyName: workflowName,
          configuration: JSON.stringify({
            task_routing: {
              filters: [
                {
                  // Route to specific worker when targetWorker is specified, with failover
                  filter_friendly_name: 'Specific Worker Filter with Failover',
                  expression: 'targetWorker != null',
                  targets: [
                                          {
                        // First target: Try to route to the specific worker with priority
                        queue: taskQueue?.sid || '',
                        expression: `worker.friendly_name == task.targetWorker`,
                        timeout: 1, // Wait 1 second for the specific worker
                      },
                      {
                        // Second target: Failover to any available worker
                        queue: taskQueue?.sid || '',
                        // No expression means any available worker in the queue
                      },
                    ],
                  },
                ],
                default_filter: {
                  queue: taskQueue?.sid || '', // Route to any available agent when no targetWorker specified
                },
            },
          }),
        });
              log.green({
          label: 'createTaskRouter',
          message: 'New Workflow created with failover',
          data: workflow?.sid,
        });
    }

    // Save Workflow SID to .env
    if (workflow?.sid) {
      await updateEnvFile('TWILIO_WORKFLOW_SID', workflow.sid);
    }

    return { workspace: workSpace, taskQueue, workflow };
  } catch (error) {
    log.error({
      label: 'createTaskRouter',
      message: 'Error creating TaskRouter service',
      data: error,
    });
    throw error;
  }
}
