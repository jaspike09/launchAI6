import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Defining the Board of Directors
    const boardRoles = [
      { name: "CMO (Marketing)", focus: "Virality, user acquisition, and branding." },
      { name: "CPO (Product)", focus: "Feature roadmap, user experience, and tech stack." },
      { name: "CFO (Finance)", focus: "Revenue models, pricing, and 12-month runway." }
    ];

    // Running the meeting (All agents think at once)
    const boardResponses = await Promise.all(
      boardRoles.map(async (role) => {
        const result = await model.generateContent(
          `You are the ${role.name}. Focus: ${role.focus}. Analyze this idea: ${prompt}`
        );
        return { role: role.name, feedback: result.response.text() };
      })
    );

    // The Architect summarizes it all
    const architectResult = await model.generateContent(
      `You are the Lead Business Architect. Summarize these board notes into a 5-step execution plan: ${JSON.stringify(boardResponses)}`
    );

    return NextResponse.json({
      architect: architectResult.response.text(),
      board: boardResponses
    });

  } catch (error) {
    return NextResponse.json({ error: "Board is offline" }, { status: 500 });
  }
}
