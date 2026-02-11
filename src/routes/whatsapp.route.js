const whatsappService = require("../services/whatsapp.service");
const visionService = require("../services/vision.service");
const aiService = require("../services/ai.service");
const marketService = require("../services/market.service");
const { sendWhatsAppMessage } = require("../services/whatsapp.send");
const express = require("express");
const router = express.Router();

router.post("/webhook", async (req, res) => {
  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const from = message.from;

  if (message.type === "image") {
    const imagePath = await whatsappService.downloadMedia(
      message.image.id
    );

    const crop = "cassava"; // or infer later
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

  res.sendStatus(200);
});

module.exports = router;
