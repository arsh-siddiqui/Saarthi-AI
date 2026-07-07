import Groq from "groq-sdk";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is missing. Add it to your .env.local file (see .env.example)."
      );
    }
    client = new Groq({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `You are the Saarthi AI Assistant, an expert guide to Indian government services.
You help citizens understand government processes, required documents, eligibility, fees, and where to go.
Be concise, warm, and practical. Use short paragraphs or bullet points. Never invent office addresses or
phone numbers you are not given — instead tell the user to confirm at their nearest government office or
the relevant official portal. When asked about a specific place shown on a map, answer using the address
and hours provided in the context.`;

export interface AskGroqOptions {
  context?: string;
  model?: string;
  language?: string;
  json?: boolean;
  images?: string[];
}

export async function askGroq(
  message: string,
  options: AskGroqOptions = {}
): Promise<string> {
  const groq = getClient();
  const { context, language, json = false, images } = options;

  let model = options.model;
  if (!model) {
    model = (images && images.length > 0) ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";
  }

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (language && language !== "English") {
    messages.push({
      role: "system",
      content: `CRITICAL: You must write your response entirely in the language: ${language}. Keep the tone polite, concise, and structured.`,
    });
  }

  if (context) {
    messages.push({
      role: "system",
      content: `Additional context for this request:\n${context}`,
    });
  }

  if (images && images.length > 0) {
    const userContent: Record<string, unknown>[] = [{ type: "text", text: message }];
    images.forEach((img) => {
      userContent.push({
        type: "image_url",
        image_url: { url: img },
      });
    });
    messages.push({ role: "user", content: userContent });
  } else {
    messages.push({ role: "user", content: message });
  }

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.4,
    max_tokens: 1000,
    response_format: json ? { type: "json_object" } : undefined,
  });

  const reply = completion.choices[0]?.message?.content;
  if (!reply) {
    throw new Error("Groq returned an empty response.");
  }
  return reply.trim();
}
