import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
    try {
        const { image1, image2 } = await req.json();
        
        const ai = new GoogleGenAI({});
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Compare the following two images and provide a similarity score between 0 to 100 along with a brief explanation:\n\nImage 1: ${image1}\n\nImage 2: ${image2}`,
        }) 

        console.log("Generated response:", response.text);
        return NextResponse.json(response.text);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}