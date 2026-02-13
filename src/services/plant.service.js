const plants = require("../data/plants.db.json");

exports.getPlantInfo = (plantName) => {
  if (!plantName) return null;

  const key = plantName.toLowerCase();
  return plants[key] || null;
};