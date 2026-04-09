import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import { ENV } from "../lib/env.js";
import fetch from "node-fetch";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      let user = await User.findOne({ clerkId });

      if (!user) {
        // Fetch user from Clerk and create locally (Inngest may not be running locally)
        const resp = await fetch(`https://api.clerk.dev/v1/users/${clerkId}`, {
          headers: { Authorization: `Bearer ${ENV.CLERK_SECRET_KEY}` },
        });

        if (!resp.ok) return res.status(404).json({ message: "User not found" });

        const data = await resp.json();

        const newUser = {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown",
          profileImage: data.image_url || "",
        };

        user = await User.create(newUser);

        // ensure stream chat user exists
        await upsertStreamUser({
          id: user.clerkId.toString(),
          name: user.name,
          image: user.profileImage,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];