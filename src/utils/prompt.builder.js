const fertilizerRules = require("../data/fertilizer.rules");

exports.buildPrompt = ({
  crop,
  diagnosis,
  marketAdvice,
  language,
  location,
}) => {
  const fertilizer = fertilizerRules[crop?.toLowerCase()];

  return `
    You are an agricultural extension officer helping small farmers in ${location}.
    Speak in simple ${language === "pidgin" ? "Nigerian Pidgin" : "English"}.

    Crop: ${crop}
    Disease detected: ${diagnosis.disease}
    Cause: ${diagnosis.cause}

    Fertilizer advice:
    ${fertilizer ? JSON.stringify(fertilizer) : "No fertilizer needed"}

    Market advice:
    ${marketAdvice}

    Explain:
    1. What the problem is
    2. What the farmer should do now
    3. How to prevent it
    4. When and where to sell for better profit
    `;
};
