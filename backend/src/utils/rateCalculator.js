export function calculateRate(baseRate, equipmentMultiplier, totalWeight, distanceKm, accessorials = {}) {
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

  // Fixed prices for accessories
  const accessoryPrices = {
    liftgate: 15, // Tailgate / Liftgate Service ($15)
    appointment: 20, // Appointment / Scheduled Delivery ($20)
    residential: 25, // Inside / Residential Delivery ($25)
  };

  // Calculate total for selected accessories
  const accessoriesTotal = Object.keys(accessorials).reduce((total, key) => {
    if (accessorials[key]) {
      return total + (accessoryPrices[key] || 0);
    }
    return total;
  }, 0);

  // Total quote
  const totalQuote = adjustedBaseRate + weightSurcharge + fuelSurcharge + accessoriesTotal;

  return {
    baseRate,
    equipmentMultiplier,
    weightSurcharge: parseFloat(weightSurcharge.toFixed(2)),
    fuelSurcharge: parseFloat(fuelSurcharge.toFixed(2)),
    accessoriesTotal: parseFloat(accessoriesTotal.toFixed(2)), // Include accessories total
    totalQuote: parseFloat(totalQuote.toFixed(2)), // Final total quote
  };
}
