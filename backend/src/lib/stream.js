import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("❌ STREAM_API_KEY or STREAM_API_SECRET is missing");
}

console.log("🔑 Stream initialized with API key:", apiKey?.substring(0, 10) + "...");

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    console.log("🔍 upsertStreamUser called with:", JSON.stringify(userData, null, 2));

    if (!userData.id) {
      throw new Error("User ID is required for Stream");
    }

    const userPayload = {
      id: userData.id,
      name: userData.name || "Anonymous User",
      image: userData.image || "",
      role: "user", // Add role
      language: "en", // Add language
    };

    console.log("📤 Upserting to Stream with payload:", JSON.stringify(userPayload, null, 2));

    const response = await chatClient.upsertUser(userPayload);

    console.log("✅ Stream upsert response:", JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error("❌ Error upserting Stream user:");
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
    if (error.response) {
      console.error("  Response data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    console.log("🗑️ Deleting Stream user:", userId);
    
    await chatClient.deleteUser(userId, { mark_messages_deleted: true });
    
    console.log("✅ Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("❌ Error deleting Stream user:", error.message);
    throw error;
  }
};
