const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.WHATSAPP_TOKEN;

exports.downloadMedia = async (mediaId) => {
  // Get media URL
  const mediaRes = await axios.get(
    `https://graph.facebook.com/v18.0/${mediaId}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );

  const mediaUrl = mediaRes.data.url;

  // Download image
  const imageRes = await axios.get(mediaUrl, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    responseType: "arraybuffer",
  });

  const filePath = path.join("uploads", `${Date.now()}.jpg`);
  fs.writeFileSync(filePath, imageRes.data);

  return filePath;
};
