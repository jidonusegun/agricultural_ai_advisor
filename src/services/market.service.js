exports.getMarketAdvice = (crop, location) => {
    const advice = {
      cassava:
        "Cassava sells well in Badagry and Mile 12 markets. Best sold 9–12 months after planting.",
      maize:
        "Maize prices rise during dry season. Store properly to sell later for better profit.",
    };
  
    return advice[crop?.toLowerCase()] || "Check local markets for best prices.";
  };