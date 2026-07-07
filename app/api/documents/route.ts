import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { documentType, language } = await req.json();

    const systemPrompt = `You are an expert Indian government document consultant. Provide accurate and reliable guidelines for obtaining documents in India.
You must output a JSON object containing exactly the following keys. All values in this JSON object MUST be translated and written in the language: ${language || "English"}.
JSON keys required:
- "requiredDocuments": An array of strings listing the physical or digital documents required to apply.
- "estimatedFees": A string detailing the estimated cost, government fees, and payment mode if applicable.
- "processingTime": A string describing the average processing/issuance time.
- "importantTips": An array of strings providing 3-4 helpful tips, official portals, or common pitfalls to avoid.
- "timeline": An object containing the citizen journey workflow with exactly these 6 keys in order: "Eligibility", "Documents", "Application", "Verification", "Approval", "Completed". The value for each key should be a short string describing what happens in that stage.

Ensure all JSON keys exist and the output is valid JSON. Do not include any text before or after the JSON.`;

    const userPrompt = `I want: ${documentType}`;

    const reply = await askGroq(userPrompt, {
      context: systemPrompt,
      json: true,
      language,
    });

    const parsed = JSON.parse(reply);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Document help processing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generating document checklist." },
      { status: 500 }
    );
  }
}
