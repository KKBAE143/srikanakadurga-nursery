import type { Express } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";

// ImageKit configuration
const IMAGEKIT_CONFIG = {
  publicKey: "public_u4RMvhnxcY+obKITfeCIpskSxPM=",
  privateKey: "private_CBO/uXE82pXkbzExkwC+uGJ8n34=",
  urlEndpoint: "https://ik.imagekit.io/vvkwy0zte",
};

// Razorpay configuration - Using test credentials
// Replace with production keys when going live
const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourTestKeyId",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourTestKeySecret",
};

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_CONFIG.key_id,
  key_secret: RAZORPAY_CONFIG.key_secret,
});

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

  // Get Razorpay key (for client-side)
  app.get("/api/razorpay/key", (req, res) => {
    res.json({ key: RAZORPAY_CONFIG.key_id });
  });

  // Create Razorpay order
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt, notes } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);

      res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
        },
      });
    } catch (error: any) {
      console.error("Razorpay create order error:", error);
      res.status(500).json({
        error: "Failed to create payment order",
        message: error.message,
      });
    }
  });

  // Verify Razorpay payment signature
  app.post("/api/razorpay/verify-payment", (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification parameters" });
      }

      // Generate expected signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_CONFIG.key_secret)
        .update(body)
        .digest("hex");

      // Verify signature
      const isValid = expectedSignature === razorpay_signature;

      if (isValid) {
        res.json({
          success: true,
          message: "Payment verified successfully",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Payment verification failed",
        });
      }
    } catch (error: any) {
      console.error("Razorpay verify payment error:", error);
      res.status(500).json({
        error: "Failed to verify payment",
        message: error.message,
      });
    }
  });

  // Get payment details (for order confirmation)
  app.get("/api/razorpay/payment/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await razorpay.payments.fetch(paymentId);

      res.json({
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
        },
      });
    } catch (error: any) {
      console.error("Razorpay fetch payment error:", error);
      res.status(500).json({
        error: "Failed to fetch payment details",
        message: error.message,
      });
    }
  });

  return httpServer;
}
