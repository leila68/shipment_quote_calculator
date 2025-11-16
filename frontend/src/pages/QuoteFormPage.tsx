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
  status?: string;
  quoteId?: number;
}

const QuoteFormPage = () => {
  const [quoteResult, setQuoteResult] = useState<QuoteBreakdown | null>(null);
  const { toast } = useToast();

  const handleQuoteSubmit = (data: any) => {
    console.log('✅ Quote result received:', data);
    
    // Transform the API response to match QuoteBreakdown interface
    if (data.success && data.quote && data.calculation) {
      const breakdown: QuoteBreakdown = {
        baseRate: data.calculation.baseRate,
        equipmentMultiplier: data.calculation.equipmentMultiplier,
        weightFactor: data.calculation.weightSurcharge,
        total: data.calculation.totalQuote,
        lane: `${data.quote.origin_city} → ${data.quote.destination_city}`,
        equipmentType: data.quote.equipment_type,
        weight: data.quote.total_weight,
        status: data.quote.status,
        quoteId: data.quote.id,
      };
      
      setQuoteResult(breakdown);
      
      toast({
        title: "Quote calculated successfully!",
        description: `Total: $${data.calculation.totalQuote.toFixed(2)} • Status: ${data.quote.status}`,
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
