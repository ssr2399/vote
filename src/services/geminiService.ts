import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, promptCache } from "./constants";

const apiKey = process.env.GEMINI_API_KEY;
// Only initialize GoogleGenAI if we actually have a key
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const askTutorialAssistant = async (question: string) => {
    if (promptCache.has(question)) {
        return promptCache.get(question)!;
    }
    try {
        if (!ai) {
             // Mock delay
             await new Promise(resolve => setTimeout(resolve, 1000));
        
             let mockResponse = "I'm a simulated version of the tutorial assistant. To unlock real AI responses with Gemini, please associate your Gemini API key in the platform Secrets tab. Make sure you bring a valid photo ID when voting!";
             
             if (question.toLowerCase().includes("evm")) {
                 mockResponse = "An EVM (Electronic Voting Machine) is a device used to cast your vote electronically. To use it, simply locate the candidate of your choice on the screen or button panel and press the corresponding button. A light or sound will typically confirm your selection.";
             } else if (question.toLowerCase().includes("register") || question.toLowerCase().includes("registration")) {
                 mockResponse = "To register to vote, you can usually visit your local election office, apply by mail, or register online through your state's official voting portal.";
             } else if (question.toLowerCase().includes("where")) {
                 mockResponse = "Your polling location depends on your registered residential address. You can look it up using the Voter Profile Status section on this dashboard!";
             }
             
             promptCache.set(question, mockResponse);
             return mockResponse;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: question,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });
        
        const text = response.text || "I'm having trouble connecting right now. Please try again in a moment.";
        promptCache.set(question, text);
        return text;
    } catch (_error) {
        // Gemini API unavailable — return user-friendly fallback
        return "I'm having trouble connecting right now. Please try again in a moment.";
    }
}
