const visionService = require("../services/vision.service");
const aiService = require("../services/ai.service");
const marketService = require("../services/market.service");

exports.diagnoseCrop = async (req, res) => {
  try {
    const { crop, language = "english", location = "Badagry" } = req.body;
    const imagePath = req.file.path;

    // 1. Computer vision diagnosis
    const diagnosis = await visionService.analyzeCrop(imagePath, crop);

    // 2. Market advice
    const marketAdvice = marketService.getMarketAdvice(crop, location);

    // 3. AI explanation
    const aiResponse = await aiService.generateAdvice({
      crop,
      diagnosis,
      marketAdvice,
      language,
      location,
    });

    res.json({
      success: true,
      crop,
      diagnosis,
      advice: aiResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Diagnosis failed" });
  }
};