import type { Express } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// ImageKit configuration
const IMAGEKIT_CONFIG = {
  publicKey: "public_u4RMvhnxcY+obKITfeCIpskSxPM=",
  privateKey: "private_CBO/uXE82pXkbzExkwC+uGJ8n34=",
  urlEndpoint: "https://ik.imagekit.io/vvkwy0zte",
};

// Generate ImageKit upload authentication parameters
function getUploadAuthParams(): { token: string; expire: number; signature: string } {
  const token = uuidv4();
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
  const signature = crypto
    .createHmac("sha1", IMAGEKIT_CONFIG.privateKey)
    .update(token + expire)
    .digest("hex");

  return { token, expire, signature };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ImageKit authentication endpoint
  app.get("/api/imagekit-auth", (req, res) => {
    try {
      const { token, expire, signature } = getUploadAuthParams();
      res.json({
        token,
        expire,
        signature,
        publicKey: IMAGEKIT_CONFIG.publicKey,
      });
    } catch (error) {
      console.error("ImageKit auth error:", error);
      res.status(500).json({ error: "Failed to generate authentication parameters" });
    }
  });

  return httpServer;
}
