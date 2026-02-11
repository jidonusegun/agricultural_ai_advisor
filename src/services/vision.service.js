exports.analyzeCrop = async (imagePath, crop) => {
    // Simulated diagnosis (MVP)
    const mockResults = {
      cassava: {
        disease: "Cassava Mosaic Disease",
        confidence: 0.92,
        cause: "Virus spread by whiteflies",
      },
      maize: {
        disease: "Nitrogen Deficiency",
        confidence: 0.88,
        cause: "Low soil nutrients",
      },
    };
  
    return (
      mockResults[crop?.toLowerCase()] || {
        disease: "Healthy",
        confidence: 0.95,
        cause: "No visible disease",
      }
    );
  };  