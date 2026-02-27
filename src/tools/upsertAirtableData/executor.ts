// External npm packages
import Airtable from 'airtable';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export interface UpsertAirtableRecordParams {
  queryField: 'phone' | 'email';
  queryValue: string;
  data: Record<string, string>;
}

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    airtableApiKey: airTableApiKeyEnv,
    airtableBaseId: airTableBaseIdEnv,
    airtableBaseName: airTableNameEnv,
  } = process.env;

  return {
    airTableApiKeyUpsert: toolData?.airtableApiKey || airTableApiKeyEnv,
    airTableBaseIdUpsert: toolData?.airtableBaseId || airTableBaseIdEnv,
    airTableNameUpsert: toolData?.airtableBaseName || airTableNameEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { queryField, queryValue, data } = args as unknown as UpsertAirtableRecordParams;
  const { airTableApiKeyUpsert, airTableBaseIdUpsert, airTableNameUpsert } =
    getToolEnvData(toolData);

  try {
    if (!airTableApiKeyUpsert) {
      throw new Error(
        `Missing Airtable API Key. Please provide AIRTABLE_API_KEY in environment`
      );
    }

    if (!airTableBaseIdUpsert) {
      throw new Error(
        `Missing Airtable Base ID. Please provide AIRTABLE_BASE_ID in environment`
      );
    }

    if (!airTableNameUpsert) {
      throw new Error(
        `Missing Airtable Base Name. Please provide AIRTABLE_BASE_NAME in environment`
      );
    }

    const airtableBase = new Airtable({ apiKey: airTableApiKeyUpsert }).base(
      airTableBaseIdUpsert
    );
    const tableName = airTableNameUpsert as string;

    const records = await airtableBase(tableName)
      .select({
        filterByFormula: `{${queryField}} = '${queryValue}'`,
        maxRecords: 1,
      })
      .firstPage();

    const record = records[0] ?? null;

    if (record) {
      console.log(`Updating existing record for ${queryField} = ${queryValue}`);
      const updatedRecord = await airtableBase(tableName).update([
        { id: record.id, fields: data },
      ]);

      await sendToWebhook(
        {
          sender: 'system:customer_profile_airtable',
          type: 'JSON',
          message: JSON.stringify({ airtableData: updatedRecord }),
          phoneNumber: queryField === 'phone' ? queryValue : '',
        },
        process.env.WEBHOOK_URL
      ).catch((err) => console.error('Failed to send to webhook:', err));

      return {
        success: true,
        data: {
          message: `Updated record for ${queryField} = ${queryValue}`,
          content: updatedRecord,
        },
      };
    } else {
      console.log(`Creating new record for ${queryField} = ${queryValue}`);
      const newRecord = await airtableBase(tableName).create([
        { fields: { [queryField]: queryValue, ...data } },
      ]);
      return {
        success: true,
        data: {
          message: `Created new record for ${queryField} = ${queryValue}`,
          content: newRecord,
        },
      };
    }
  } catch (err) {
    let errorMessage = 'Failed to upsert Airtable record';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}