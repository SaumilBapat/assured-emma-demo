// External npm packages
import Airtable from 'airtable';

// Local imports
import { ToolResult, LocalTemplateData } from '../../lib/types';
import { sendToWebhook } from '../../lib/utils/webhook';

export type GetAirtableDataParams = {
  phoneNumber: string;
};

function getToolEnvData(toolData: LocalTemplateData['toolData']) {
  const {
    airtableApiKey: airTableApiKeyEnv,
    airtableBaseId: airTableBaseIdEnv,
    airtableBaseName: airTableNameEnv,
  } = process.env;

  return {
    airTableApiKeyGet: toolData?.airtableApiKey || airTableApiKeyEnv,
    airTableBaseIdGet: toolData?.airtableBaseId || airTableBaseIdEnv,
    airTableNameGet: toolData?.airtableBaseName || airTableNameEnv,
  };
}

export async function execute(
  args: Record<string, unknown>,
  toolData: LocalTemplateData['toolData']
): Promise<ToolResult> {
  const { phoneNumber } = args as GetAirtableDataParams;
  const { airTableApiKeyGet, airTableBaseIdGet, airTableNameGet } =
    getToolEnvData(toolData);

  try {
    if (!airTableApiKeyGet) {
      throw new Error(
        `Missing Airtable API Key. Please provide AIRTABLE_API_KEY in environment`
      );
    }

    if (!airTableBaseIdGet) {
      throw new Error(
        `Missing Airtable Base ID. Please provide AIRTABLE_BASE_ID in environment`
      );
    }

    if (!airTableNameGet) {
      throw new Error(
        `Missing Airtable Base Name. Please provide AIRTABLE_BASE_NAME in environment`
      );
    }

    if (!phoneNumber) {
      throw new Error(`Missing Phone Number. Please provide in args`);
    }

    const airtableBase = new Airtable({ apiKey: airTableApiKeyGet }).base(
      airTableBaseIdGet
    );

    const records = await airtableBase(airTableNameGet as string)
      .select({
        filterByFormula: `{phone} = '${phoneNumber}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return {
        success: true,
        data: null,
      };
    }

    const record = records[0];
    const rawData = record.fields;

    await sendToWebhook(
      {
        sender: 'system:customer_profile_airtable',
        type: 'JSON',
        message: JSON.stringify({ airtableData: rawData }),
        phoneNumber,
      },
      process.env.WEBHOOK_URL
    ).catch((err) => console.error('Failed to send to webhook:', err));

    return {
      success: true,
      data: rawData,
    };
  } catch (err) {
    let errorMessage = 'Failed to get Airtable record';
    errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err) || errorMessage;

    return {
      success: false,
      error: errorMessage,
    };
  }
}