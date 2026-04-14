const express = require("express");
const stripeLib = require("stripe");
const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const User = require("../models/User");

const router = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

function assertStripeConfigured() {
  if (!STRIPE_SECRET_KEY) {
    const err = new Error("Missing STRIPE_SECRET_KEY");
    err.statusCode = 500;
    throw err;
  }
}

function getFrontendUrl(req) {
  const env = process.env.FRONTEND_URL;
  if (env) return env.replace(/\/$/, "");

  const origin = req.headers.origin;
  if (typeof origin === "string" && origin.trim()) return origin.replace(/\/$/, "");

  return "http://localhost:3000";
}

function planConfig(planId) {
  switch (planId) {
    case "starter":
      return { planId: "starter", planName: "Starter", amount: 4900, currency: "gbp" };
    case "plus":
      return { planId: "plus", planName: "Plus", amount: 9900, currency: "gbp" };
    case "pro":
      return { planId: "pro", planName: "Pro", amount: 19900, currency: "gbp" };
    default:
      return null;
  }
}

// Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    assertStripeConfigured();
    const stripe = stripeLib(STRIPE_SECRET_KEY);

    const { planId, userId, purchaserName, purchaserEmail } = req.body || {};

    if (!planId || !userId) {
      return res.status(400).json({ message: "planId and userId are required" });
    }

    const plan = planConfig(String(planId));
    if (!plan) {
      return res.status(400).json({ message: "Invalid planId" });
    }

    const frontendUrl = getFrontendUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: purchaserEmail ? String(purchaserEmail) : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: plan.currency,
            unit_amount: plan.amount,
            product_data: {
              name: `Jawily Premium - ${plan.planName}`,
            },
          },
        },
      ],
      success_url: `${frontendUrl}/premium?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/premium?canceled=1`,
      metadata: {
        userId: String(userId),
        purchaserName: purchaserName ? String(purchaserName) : "",
        purchaserEmail: purchaserEmail ? String(purchaserEmail) : "",
        planId: plan.planId,
        planName: plan.planName,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return res
      .status(error?.statusCode || 500)
      .json({ message: "Failed to create checkout session" });
  }
});

// Verify checkout session after success redirect (no webhook)
router.get("/verify-session", async (req, res) => {
  try {
    assertStripeConfigured();
    const stripe = stripeLib(STRIPE_SECRET_KEY);

    const sessionId = String(req.query.sessionId || "");
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: `Payment not completed (status: ${session.payment_status})` });
    }

    const userId = session?.metadata?.userId;
    const purchaserName = session?.metadata?.purchaserName || "";
    const purchaserEmail =
      session?.customer_details?.email || session?.customer_email || session?.metadata?.purchaserEmail || "";
    const planId = session?.metadata?.planId;
    const planName = session?.metadata?.planName;

    if (!userId || !planId || !planName) {
      return res.status(400).json({ message: "Missing required session metadata" });
    }

    let resolvedEmail = String(purchaserEmail || "");
    if (!resolvedEmail && userId) {
      const u = await User.findById(String(userId));
      if (u?.email) resolvedEmail = String(u.email);
    }

    const doc = {
      userId: String(userId),
      purchaserName: String(purchaserName || ""),
      purchaserEmail: String(resolvedEmail || ""),
      planId: String(planId),
      planName: String(planName),
      amount: typeof session.amount_total === "number" ? session.amount_total : 0,
      currency: session.currency || "gbp",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent ? String(session.payment_intent) : "",
      status: "paid",
    };

    const saved = await Purchase.findOneAndUpdate(
      { stripeSessionId: session.id },
      { $set: doc },
      { upsert: true, new: true }
    );

    return res.status(200).json(saved);
  } catch (error) {
    console.error("Verify session error:", error);
    return res
      .status(error?.statusCode || 500)
      .json({ message: "Failed to verify session" });
  }
});

// Get purchases for a user
router.get("/purchases", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const purchases = await Purchase.find({ userId: String(userId) }).sort({ createdAt: -1 });
    return res.status(200).json(purchases);
  } catch (error) {
    console.error("Load purchases error:", error);
    return res.status(500).json({ message: "Failed to load purchases" });
  }
});

// Admin: list all purchases
router.get("/admin/purchases", async (req, res) => {
  try {
    const adminEmail = String(req.headers["x-admin-email"] || "");
    const adminPassword = String(req.headers["x-admin-password"] || "");

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ message: "Missing ADMIN_EMAIL or ADMIN_PASSWORD" });
    }

    if (!adminEmail || !adminPassword) {
      return res.status(401).json({ message: "Missing admin credentials" });
    }

    if (adminEmail !== process.env.ADMIN_EMAIL || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const purchases = await Purchase.find({}).sort({ createdAt: -1 });

    const purchasesWithEmail = await Promise.all(
      purchases.map(async (p) => {
        if (p.purchaserEmail) return p;
        if (!p.userId) return p;

        const id = String(p.userId);
        if (!mongoose.isValidObjectId(id)) return p;

        try {
          const u = await User.findById(id);
          if (!u?.email) return p;

          p.purchaserEmail = String(u.email);
          await p.save();
        } catch (e) {
          return p;
        }
        return p;
      })
    );

    return res.status(200).json(purchasesWithEmail);
  } catch (error) {
    console.error("Admin purchases load error:", error);
    return res.status(500).json({ message: "Failed to load purchases" });
  }
});

module.exports = router;
