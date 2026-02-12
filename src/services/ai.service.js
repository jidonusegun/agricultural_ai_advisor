const OpenAI = require("openai");
const { buildPrompt } = require("../utils/prompt.builder");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateAdvice = async (data) => {
  const prompt = buildPrompt(data);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });
  return response.choices[0].message.content;
};