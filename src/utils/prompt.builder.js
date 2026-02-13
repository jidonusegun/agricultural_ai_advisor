const fertilizerRules = require("../data/fertilizer.rules");

exports.buildPrompt = ({
  crop,
  diagnosis,
  marketAdvice,
  language,
  location,
  userQuestion,
}) => {
  const fertilizer = fertilizerRules[crop?.toLowerCase()];

  return `
    You are an agricultural expert helping local farmers.

    Crop: ${crop}
    Location: ${location}
    Plant condition from image analysis:
    Disease: ${diagnosis?.disease}
    Confidence: ${diagnosis?.confidence}
    Cause: ${diagnosis?.cause}

    Market info: ${marketAdvice}

    Farmer question:
    "${userQuestion}"

    IMPORTANT RULES:
    - Answer ONLY the farmer’s question
    - Do NOT give extra advice
    - If plant is healthy, say clearly
    - If disease detected, explain simply
    - If market question, give buyer info only
    - If treatment question, give treatment only
    - Use simple ${language}
    - Keep answer short and practical
    `;
};
