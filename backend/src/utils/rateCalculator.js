export function calculateRate(baseRate, equipmentMultiplier, totalWeight, distanceKm) {
  // Base rate with equipment multiplier
  const adjustedBaseRate = baseRate * equipmentMultiplier;

  // Weight surcharge: $0.10 per 100lbs over 10,000lbs
  const weightThreshold = 10000;
  let weightSurcharge = 0;

  if (totalWeight > weightThreshold) {
    const excessWeight = totalWeight - weightThreshold;
    weightSurcharge = (excessWeight / 100) * 0.10;
  }

  // Fuel surcharge: $0.15 per km
  const fuelSurcharge = distanceKm * 0.15;

  // Total quote
  const totalQuote = adjustedBaseRate + weightSurcharge + fuelSurcharge;

  return {
    baseRate,
    equipmentMultiplier,
    weightSurcharge: parseFloat(weightSurcharge.toFixed(2)),
    fuelSurcharge: parseFloat(fuelSurcharge.toFixed(2)),
    totalQuote: parseFloat(totalQuote.toFixed(2))
  };
}
