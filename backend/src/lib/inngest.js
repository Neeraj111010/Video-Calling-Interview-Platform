import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq1" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    console.log("📥 Received Clerk data:", {
      id,
      email: email_addresses[0]?.email_address,
      first_name,
      last_name,
      image_url
    });

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    console.log("💾 Creating MongoDB user:", newUser);
    await User.create(newUser);

    const streamUserData = {
      id: newUser.clerkId.toString(),
      name: newUser.name || "User",
      image: newUser.profileImage || "",
    };

    console.log("📹 Sending to Stream:", streamUserData);
    
    const streamResponse = await upsertStreamUser(streamUserData);
    
    console.log("✅ Stream response:", streamResponse);
    
    return { success: true, user: newUser, streamResponse };
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    
    console.log("🗑️ Deleting user:", id);
    
    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
    
    console.log("✅ User deleted successfully");
  }
);

export const functions = [syncUser, deleteUserFromDB];