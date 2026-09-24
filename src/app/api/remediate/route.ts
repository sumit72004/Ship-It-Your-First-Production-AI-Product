import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { analyzeAccessibilityHeuristics } from "@/lib/heuristicA11y";
import { AccessibilityResult } from "@/types/accessibility";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, userApiKey } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid code snippet to remediate." },
        { status: 400 }
      );
    }

    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;

    // If no API key is configured, seamlessly fallback to our comprehensive heuristic engine
    if (!apiKey) {
      const fallbackResult = analyzeAccessibilityHeuristics(code);
      return NextResponse.json({
        ...fallbackResult,
        notice: "Processed using AccessiCraft's offline heuristic engine. To use Claude 3.5 Sonnet, add ANTHROPIC_API_KEY to .env or supply it in settings."
      });
    }

    // Call Anthropic Claude API
    try {
      const anthropic = new Anthropic({ apiKey });

      const systemPrompt = `You are AccessiCraft AI, a world-class Web Accessibility (a11y) and W3C WCAG 2.1 AA/AAA compliance engineer.
Your task is to analyze the provided HTML/JSX/component code, identify all accessibility barriers, and output a production-ready, fully accessible remediated version along with structured diagnostic data.

Respond ONLY with a valid JSON object matching this schema. Do not add markdown commentary outside the JSON:
{
  "score": number (0-100),
  "complianceLevel": "Non-Compliant" | "WCAG 2.1 A" | "WCAG 2.1 AA" | "WCAG 2.1 AAA",
  "summary": "Concise 2-3 sentence overview of compliance status and critical remediation actions",
  "issues": [
    {
      "id": "wcag-rule-identifier",
      "criterion": "e.g., 1.1.1 Non-text Content (Level A)",
      "principle": "Perceivable" | "Operable" | "Understandable" | "Robust",
      "level": "A" | "AA" | "AAA",
      "severity": "critical" | "serious" | "moderate" | "minor",
      "title": "Clear concise issue title",
      "description": "What is broken and why it affects users",
      "recommendation": "Exact coding step to fix it",
      "impact": "Specific impact on screen reader / keyboard / assistive tech users",
      "codeSnippet": "Offending code snippet"
    }
  ],
  "remediatedCode": "Clean, fully accessible HTML/JSX/Tailwind code with complete ARIA labels, semantic tags, keyboard focus rings, and valid contrast",
  "screenReaderWalkthrough": [
    {
      "step": 1,
      "focusedElement": "Element name or role",
      "announcedText": "Exact text vocalized by NVDA / VoiceOver",
      "keyboardAction": "Tab / Enter / Space / Arrow Key",
      "annotation": "Why this announcement helps the user"
    }
  ],
  "keyboardNavigationMap": [
    "Step-by-step description of keyboard navigation order and hotkeys"
  ],
  "keyImprovements": [
    "Bullet points of major accessibility enhancements made"
  ]
}`;

      const userPrompt = `Analyze and remediate this UI code for WCAG 2.1 AA compliance:\n\n\`\`\`html\n${code}\n\`\`\``;

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3500,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      // Extract text
      const contentBlock = message.content[0];
      if (contentBlock.type !== "text") {
        throw new Error("Unexpected non-text response from Claude.");
      }

      let rawResponse = contentBlock.text.trim();
      // Strip potential markdown wrapper
      if (rawResponse.startsWith("```json")) {
        rawResponse = rawResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (rawResponse.startsWith("```")) {
        rawResponse = rawResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed: AccessibilityResult = JSON.parse(rawResponse);
      parsed.engine = "Claude 3.5 Sonnet";
      parsed.timestamp = new Date().toISOString();

      return NextResponse.json(parsed);
    } catch (llmError: unknown) {
      console.warn("Claude API call failed, activating graceful heuristic fallback:", llmError);
      const fallbackResult = analyzeAccessibilityHeuristics(code);
      return NextResponse.json({
        ...fallbackResult,
        notice: "Claude API unavailable or returned an error. Seamlessly fell back to AccessiCraft's offline heuristic engine."
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
