import OpenAI from 'openai';
import { emitDemo } from './demoEvents';
import fetch from 'node-fetch';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rolling transcript buffer for context
const transcriptBuffer: { role: 'caller' | 'agent'; text: string }[] = [];

export function addToTranscript(role: 'caller' | 'agent', text: string) {
  transcriptBuffer.push({ role, text });
  if (transcriptBuffer.length > 20) transcriptBuffer.shift(); // keep last 20 turns
}

export async function analyzeCallerUtterance(text: string) {
  if (!text || text.trim().length < 3) return;

  const context = transcriptBuffer
    .slice(-6)
    .map(t => `${t.role === 'caller' ? 'Caller' : 'Agent'}: ${t.text}`)
    .join('\n');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a real-time call analytics engine for an insurance claims call center. Analyze the caller's latest utterance in context and return JSON with exactly these fields:
{
  "sentiment": <number 0-100, where 0=very angry, 50=neutral, 100=very happy>,
  "sentimentLabel": <"positive"|"neutral"|"frustrated"|"angry"|"anxious">,
  "intents": <array of 1-3 short intent strings, e.g. ["Check claim status", "Report vehicle damage"]>,
  "entities": <array of detected entities like claim numbers, names, locations, vehicle info, dates>,
  "flags": <array of alert strings from: "competitor_mention", "escalation_risk", "injury_mentioned", "frustration", "satisfied", "urgent", "legal_threat">
}
Only return valid JSON.`
        },
        {
          role: 'user',
          content: `Recent conversation:\n${context}\n\nLatest caller utterance: "${text}"\n\nAnalyze this.`
        }
      ]
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(raw);

    emitDemo('ci:update', {
      sentiment: result.sentiment ?? 60,
      sentimentLabel: result.sentimentLabel ?? 'neutral',
      intents: result.intents ?? [],
      entities: result.entities ?? [],
      flags: result.flags ?? [],
      utterance: text,
    });
  } catch (err) {
    // Silent fail — don't interrupt the call
    console.error('CI analyzer error:', err);
  }
}

export async function analyzeDamageImage(mediaUrl: string, accountSid: string, authToken: string) {
  try {
    // Fetch the image from Twilio (requires Basic Auth) and convert to base64
    const imgResponse = await fetch(mediaUrl, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
    });

    if (!imgResponse.ok) {
      throw new Error(`Failed to fetch image: ${imgResponse.status}`);
    }

    const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
    const buffer = await imgResponse.buffer();
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an AI vehicle damage estimator for Progressive Insurance. Analyze this photo and return a JSON object with:
{
  "damageAreas": ["list of damaged areas, e.g. front bumper, hood, headlight"],
  "severity": "minor|moderate|severe|total loss",
  "estimatedRepairCost": "dollar range e.g. $2,400 – $4,800",
  "repairTimeEstimate": "e.g. 3–5 business days",
  "drivable": true or false,
  "additionalNotes": "brief 1-sentence observation",
  "aiConfidence": "percentage e.g. 87%"
}
Be realistic but slightly optimistic. Only return valid JSON.`,
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl, detail: 'high' },
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || '{}';
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleaned);

    emitDemo('damage:analysis', {
      mediaUrl,
      damageAreas: result.damageAreas ?? [],
      severity: result.severity ?? 'moderate',
      estimatedRepairCost: result.estimatedRepairCost ?? 'Pending review',
      repairTimeEstimate: result.repairTimeEstimate ?? 'TBD',
      drivable: result.drivable ?? true,
      additionalNotes: result.additionalNotes ?? '',
      aiConfidence: result.aiConfidence ?? '85%',
    });

    return result;
  } catch (err) {
    console.error('Damage analysis error:', err);
    return null;
  }
}
