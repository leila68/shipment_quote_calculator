export function calculateRate(baseRate, equipmentMultiplier, totalWeight) {
    // Base rate with equipment multiplier
    const adjustedBaseRate = baseRate * equipmentMultiplier;
  
    // Weight surcharge: $0.10 per 100lbs over 10,000lbs
    const weightThreshold = 10000;
    let weightSurcharge = 0;
  
    if (totalWeight > weightThreshold) {
      const excessWeight = totalWeight - weightThreshold;
      weightSurcharge = (excessWeight / 100) * 0.10;
    }
  
    // Total quote
    const totalQuote = adjustedBaseRate + weightSurcharge;
  
    return {
      baseRate,
      equipmentMultiplier,
      weightSurcharge: parseFloat(weightSurcharge.toFixed(2)),
      totalQuote: parseFloat(totalQuote.toFixed(2))
    };
  }