import { GoogleGenAI, Chat } from "@google/genai";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY and remove unnecessary checks,
// as per the coding guidelines which state to assume the API key is always available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';
const systemInstruction = `You are a friendly and encouraging study buddy for a student. Your goal is to help them understand concepts, break down complex topics into simple terms, and provide study strategies. You should maintain the context of the conversation to answer follow-up questions. Keep your responses concise, clear, and positive. Use markdown for formatting, like lists, bold text, and italics, to make the information easy to digest. Answer all kinds of questions which are not even related to academics or productivity.`;

export const createStudyBuddyChat = (): Chat => {
  return ai.chats.create({
    model,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });
};