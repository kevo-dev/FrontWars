
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, MoveAction, Owner } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getEnemyMove(gameState: GameState): Promise<MoveAction[]> {
  const prompt = `
    You are the Enemy Commander in a real-time strategy game.
    The current state of the game:
    Bases: ${JSON.stringify(gameState.bases)}
    Active Troop Movements: ${JSON.stringify(gameState.troops)}
    
    Goal: Capture all bases. 
    Rules: You can only send troops from bases you own (ENEMY). 
    Strategy: Attack neutral bases or player bases if you have a troop advantage.
    
    Return a list of moves as JSON. Each move has "fromId" and "toId".
    Try to be smart. Don't leave your own bases empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              fromId: { type: Type.STRING },
              toId: { type: Type.STRING }
            },
            required: ["fromId", "toId"]
          }
        }
      }
    });

    const moves = JSON.parse(response.text || "[]");
    return moves;
  } catch (error) {
    console.error("Gemini AI failed to generate move:", error);
    return [];
  }
}
