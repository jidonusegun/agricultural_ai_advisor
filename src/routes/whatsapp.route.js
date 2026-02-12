const whatsappService = require("../services/whatsapp.service");
const visionService = require("../services/vision.service");
const aiService = require("../services/ai.service");
const marketService = require("../services/market.service");
const { sendWhatsAppMessage } = require("../services/whatsapp.send");

const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

////////////////////////////////////////////////////
// ✅ META WEBHOOK VERIFICATION (REQUIRED)
////////////////////////////////////////////////////
router.get("/", (req, res) => {
  res.send("Server is running");
});

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed");
    return res.sendStatus(403);
  }
});

////////////////////////////////////////////////////
// ✅ INCOMING WHATSAPP MESSAGES
////////////////////////////////////////////////////
router.post("/webhook", async (req, res) => {
  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const from = message.from;

  try {
    if (message.type === "image") {
      const imagePath = await whatsappService.downloadMedia(
        message.image.id
      );

      const crop = "cassava";
      const diagnosis = await visionService.analyzeCrop(imagePath, crop);
      const marketAdvice = marketService.getMarketAdvice(crop, "Badagry");

      const advice = await aiService.generateAdvice({
        crop,
        diagnosis,
        marketAdvice,
        language: "pidgin",
        location: "Badagry",
      });

      await sendWhatsAppMessage(from, advice);
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }

  res.sendStatus(200);
});

module.exports = router;