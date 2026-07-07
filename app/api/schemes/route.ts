import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { z } from "zod";

const schemesSchema = z.object({
  age: z.coerce.number().min(0).max(120),
  state: z.string().min(1, "State is required"),
  occupation: z.string().min(1, "Occupation is required"),
  student: z.boolean().optional(),
  income: z.coerce.number().min(0),
  gender: z.string().optional(),
  language: z.string().optional(),
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

  const parsed = schemesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { age, state, occupation, student, income, gender, language } = parsed.data;

  try {

    const systemPrompt = `You are a social welfare scheme recommender for the Government of India.
Recommend 3 relevant government schemes (central or state-specific) matching the user's profile.
You must output a JSON array of objects. Each object in the array MUST contain exactly the following keys. All values in this JSON array MUST be translated and written in the language: ${language || "English"}.
JSON keys required for each object:
- "name": The official name of the scheme.
- "whyEligible": An explanation of why the user's profile matches this scheme.
- "benefits": The key benefits (financial, health, educational, subsidy, etc.) provided.
- "documentsRequired": An array of strings listing required application documents.
- "applySteps": An array of strings listing the step-by-step process to apply.

Ensure all keys exist and the output is a valid JSON array of objects. Do not include any text before or after the JSON.`;

    const userPrompt = `Profile:
Age: ${age} years
State: ${state}
Occupation: ${occupation}
Student: ${student ? "Yes" : "No"}
Annual Income: Rs. ${income}
Gender: ${gender || "Not specified"}`;

    const reply = await askGroq(userPrompt, {
      context: systemPrompt,
      json: true,
      language,
    });

    let parsed = JSON.parse(reply);
    
    // Sometimes LLMs wrap the array in an object like { schemes: [...] }
    if (parsed && !Array.isArray(parsed)) {
      if (Array.isArray(parsed.schemes)) {
        parsed = parsed.schemes;
      } else if (parsed.name && parsed.whyEligible) {
        parsed = [parsed];
      } else {
        parsed = Object.values(parsed).find(Array.isArray) || [];
      }
    }
    
    if (!Array.isArray(parsed)) {
      parsed = [];
    }
    
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Scheme recommendation processing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generating scheme recommendations." },
      { status: 500 }
    );
  }
}
