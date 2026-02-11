import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const roles = [
      { id: "cmo", name: "Marketing Director", prompt: "Focus on viral growth and customer acquisition." },
      { id: "cpo", name: "Product Director", prompt: "Focus on MVP features and user experience." },
      { id: "cfo", name: "Financial Director", prompt: "Focus on pricing strategy and revenue." }
    ];

    // Parallel execution for speed
    const boardResults = await Promise.all(
      roles.map(async (role) => {
        const res = await model.generateContent(`Role: ${role.name}. ${role.prompt} Analyze: ${prompt}`);
        return { name: role.name, text: res.response.text() };
      })
    );

    // Synthesis
    const architectRes = await model.generateContent(
      `You are the Lead Business Architect. Create a master execution plan based on these director reports: ${JSON.stringify(boardResults)}`
    );

    return NextResponse.json({
      architect: architectRes.response.text(),
      board: boardResults
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
