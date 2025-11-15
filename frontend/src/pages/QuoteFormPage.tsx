import { useState } from "react";
import QuoteForm from "@/components/Quote/QuoteForm";
import QuoteResult from "@/components/Quote/QuoteResult";
import { useToast } from "@/hooks/use-toast";

interface QuoteFormData {
  originCity: string;
  destinationCity: string;
  equipmentType: string;
  totalWeight: string;
  pickupDate: string;
}

interface QuoteBreakdown {
  baseRate: number;
  equipmentMultiplier: number;
  weightFactor: number;
  total: number;
  lane: string;
  equipmentType: string;
  weight: number;
}

const QuoteFormPage = () => {
  const [quoteResult, setQuoteResult] = useState<QuoteBreakdown | null>(null);
  const { toast } = useToast();

  const handleQuoteSubmit = async (data: QuoteFormData) => {
    // TODO: Replace this mock calculation with actual backend API call
    // Example API endpoint: POST /api/quotes/calculate
    // Expected response: { baseRate, equipmentMultiplier, weightFactor, total }

    try {
      // Mock calculation logic (replace with API call)
      const weight = parseInt(data.totalWeight);
      const baseRate = 1500;
      
      // Equipment type multipliers
      const equipmentMultipliers = {
        "dry-van": 1.0,
        "reefer": 1.3,
        "flatbed": 1.2,
      };
      
      const equipmentMultiplier =
        baseRate * (equipmentMultipliers[data.equipmentType as keyof typeof equipmentMultipliers] - 1);
      
      const weightFactor = (weight / 1000) * 50;
      const total = baseRate + equipmentMultiplier + weightFactor;

      const breakdown: QuoteBreakdown = {
        baseRate,
        equipmentMultiplier,
        weightFactor,
        total,
        lane: `${data.originCity} → ${data.destinationCity}`,
        equipmentType: data.equipmentType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        weight,
      };

      setQuoteResult(breakdown);

      toast({
        title: "Quote calculated successfully!",
        description: `Total estimated cost: $${total.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Error calculating quote",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">New Shipment Quote</h1>
        <p className="mt-2 text-muted-foreground">
          Get an instant quote for your freight shipment
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <QuoteForm onSubmit={handleQuoteSubmit} />
        {quoteResult && <QuoteResult breakdown={quoteResult} />}
      </div>
    </div>
  );
};

export default QuoteFormPage;
