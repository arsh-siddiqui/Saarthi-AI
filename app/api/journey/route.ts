import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    const prompt = `Generate a detailed, step-by-step citizen journey for the following government request: "${goal}".
Return the response strictly as a JSON object with the following structure:
{
  "title": "Title of the process",
  "estimatedTotalTime": "e.g., 2-4 weeks",
  "requiredDocuments": ["Doc 1", "Doc 2"],
  "steps": [
    {
      "id": 1,
      "title": "Step title",
      "description": "Detailed description of what the citizen needs to do.",
      "estimatedTime": "e.g., 1-2 days",
      "department": "Department responsible (optional)",
      "icon": "A string representing a generic lucide-react icon name, e.g., 'FileText', 'User', 'CheckCircle', 'Building', 'Clock', 'CreditCard', 'Camera', 'MapPin'"
    }
  ]
}
Make the steps realistic for Indian government services, but keep it clear and user-friendly.`;

    const reply = await askGroq(prompt, {
      json: true,
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json(JSON.parse(reply));
  } catch (err) {
    console.error("Journey API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate journey" },
      { status: 500 }
    );
  }
}
