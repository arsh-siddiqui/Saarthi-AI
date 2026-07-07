import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { message, image, language } = await req.json();

    const systemPrompt = `You are a professional civic issue analyzer. Analyze the provided complaint text and/or image.
You must output a JSON object containing exactly the following keys. All values in this JSON object MUST be translated and written in the language: ${language || "English"}.
JSON keys required:
- "title": A short, clear title for the complaint (max 6 words).
- "description": A detailed, formal description of the issue suitable for a government official.
- "department": The specific government department responsible for fixing this (e.g., Municipal Corporation, Water Board, Electricity Department, Police Department, PWD, Waste Management).
- "priority": The priority level. Must be exactly one of: "Low", "Medium", "High".
- "category": A suggested category (e.g. Roads, Sanitation, Water supply, Streetlights, Traffic, Safety).

Ensure all JSON keys exist and the output is valid JSON. Do not include any text before or after the JSON.`;

    const userPrompt = message ? `Issue Description: ${message}` : "Analyze the attached image of a civic issue.";
    const images = image ? [image] : undefined;

    const reply = await askGroq(userPrompt, {
      context: systemPrompt,
      json: true,
      images,
      language,
    });

    const parsed = JSON.parse(reply);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Report processing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generating complaint." },
      { status: 500 }
    );
  }
}
