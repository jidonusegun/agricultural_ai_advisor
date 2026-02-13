const marketDB = require("../data/market.db.json");

exports.getMarketAdvice = (plantName, location) => {
  const plant = marketDB[plantName?.toLowerCase()];
  const loc = plant?.[location?.toLowerCase()];
  return loc || null;
};