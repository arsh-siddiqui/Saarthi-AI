import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { ChatRequestBody, ChatResponseBody } from "@/types";

import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1, "The 'message' field is required.").max(2000),
  context: z.string().optional(),
  language: z.enum(["en", "hi"]).optional(),
});

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { message, context, language } = parsed.data;

  const schemaInstruction = `\n\nReturn your response strictly as a JSON object with the following schema:
{
  "summary": "Brief summary",
  "documents": ["List of required documents"],
  "steps": ["List of steps"],
  "fees": "Fees if any (e.g. ₹1500)",
  "time": "Estimated time (e.g. 7-10 Days)",
  "tips": ["Important tips"],
  "nearbyOffices": "Any text regarding nearby offices or 'Available' if applicable",
  "nextActions": ["Find Office", "Report Issue", "Find Schemes"] // return exactly 2 relevant action buttons
}`;

  try {
    const reply = await askGroq(message + schemaInstruction, {
      context: body.context,
      language: body.language,
      json: true,
    });
    // Parse the JSON to ensure it's valid, and return the structured object
    const structuredData = JSON.parse(reply);
    return NextResponse.json({ reply: structuredData });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error contacting Groq.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
