const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeCrop = async (imagePath) => {

  const base64Image = fs.readFileSync(imagePath, {
    encoding: "base64",
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
          You are a plant pathologist and agricultural scientist.

          Analyze the plant image and return structured JSON.

          Return ONLY valid JSON:

          {
            "plant_common_name": "",
            "botanical_name": "",
            "is_healthy": true/false,
            "disease_name": "",
            "disease_type": "fungal/bacterial/viral/nutrient/pest/none",
            "severity": "low/medium/high",
            "symptoms": "",
            "causes": "",
            "treatment": "",
            "prevention": ""
          }
        `,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this plant image" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content;

  return JSON.parse(content);
};