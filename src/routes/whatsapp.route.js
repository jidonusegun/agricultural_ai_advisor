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
const processedMessages = new Set();

router.post("/webhook", async (req, res) => {

  const value = req.body.entry?.[0]?.changes?.[0]?.value;

  if (!value?.messages) {
    return res.sendStatus(200);
  }

  const message = value.messages[0];
  const from = message.from;
  const messageId = message.id;

  if (processedMessages.has(messageId)) {
    console.log("Duplicate message ignored");
    return res.sendStatus(200);
  }

  processedMessages.add(messageId);

  try {

    if (message.type !== "image") {
      return res.sendStatus(200);
    }

    console.log("Downloading image...");
    const imagePath = await whatsappService.downloadMedia(
      message.image.id
    );

    const userQuestion =
      message.image?.caption || "Analyze this crop";

    const crop = "cassava";

    const diagnosis =
      await visionService.analyzeCrop(imagePath, crop);

    const marketAdvice =
      marketService.getMarketAdvice(crop, "Badagry");

    const advice = await aiService.generateAdvice({
      crop,
      diagnosis,
      marketAdvice,
      userQuestion,
      location: "Badagry",
      language: "pidgin",
    });

    await sendWhatsAppMessage(from, advice);

  } catch (error) {
    console.error("Webhook error:", error);
    await sendWhatsAppMessage(
      from,
      "Sorry, I couldn't process your image. Try again."
    );
  }

  res.sendStatus(200);
});

module.exports = router;