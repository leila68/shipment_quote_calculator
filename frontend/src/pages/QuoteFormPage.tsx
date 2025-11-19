import { useState } from "react";
import QuoteForm from "@/components/Quote/QuoteForm";
import QuoteResult from "@/components/Quote/QuoteResult";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from "@/config/api";

interface QuoteFormData {
  originCity: string;
  destinationCity: string;
  equipmentType: string;
  totalWeight: string;
  pickupDate: string;
  accessorials: {
    liftgate: boolean;
    appointment: boolean;
    residential: boolean;
  };
}

interface QuoteBreakdown {
  baseRate: number;
  equipmentMultiplier: number;
  weightFactor: number;
  total: number;
  lane: string;
  equipmentType: string;
  weight: number;
  fuelSurcharge: number;
  liftgate: boolean;
  appointment: boolean;
  residential: boolean;
}

const QuoteFormPage = () => {
  const [quoteResult, setQuoteResult] = useState<QuoteBreakdown | null>(null);
  const [formData, setFormData] = useState<QuoteFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleQuoteCalculate = (data: any) => {
    console.log('✅ Raw data received:', data);
    
    // Store the form data for later submission
    setFormData(data.formData);
    
    // Extract calculation from nested response
    // Backend returns: { calculation: { success: true, calculation: {...} }, formData: {...} }
    const calcResponse = data.calculation;
    console.log('Calculation response:', calcResponse);
    
    // Get the actual calculation object
    const calc = calcResponse?.calculation || calcResponse;
    console.log('Actual calculation:', calc);
    
    const form = data.formData;
    
    if (!calc) {
      console.error('No calculation data found');
      toast({
        title: "Error",
        description: "Invalid response from server",
        variant: "destructive",
      });
      return;
    }
    
    // Map backend field names to frontend
    const breakdown: QuoteBreakdown = {
      baseRate: Number(calc.baseRate) || 0,
      equipmentMultiplier: Number(calc.equipmentMultiplier) || 1,
      weightFactor: Number(calc.weightSurcharge) || 0,
      fuelSurcharge: Number(calc.fuelSurcharge) || 0,
      total: Number(calc.totalQuote) || 0,
      lane: `${form.originCity} → ${form.destinationCity}`,
      equipmentType: form.equipmentType,
      weight: parseInt(form.totalWeight) || 0,
      liftgate: form.accessorials?.liftgate || false,
      appointment: form.accessorials?.appointment || false,
      residential: form.accessorials?.residential || false,
    };
    
    console.log('Final breakdown:', breakdown);
    
    // Validate that we have actual numbers
    if (breakdown.total === 0 && breakdown.baseRate === 0) {
      console.error('Calculation returned zeros');
      toast({
        title: "Error",
        description: "Calculation failed - all values are zero",
        variant: "destructive",
      });
      return;
    }
    
    setQuoteResult(breakdown);
    setIsSubmitted(false);
    
    toast({
      title: "Quote calculated!",
      description: `Total: $${breakdown.total.toFixed(2)}`,
    });
  };

  const handleQuoteSubmit = async () => {
    if (!formData || !quoteResult) {
      toast({
        title: "Error",
        description: "No quote data to submit",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      const result = await response.json();
      console.log("Quote submitted:", result);

      setIsSubmitted(true);

      toast({
        title: "Quote submitted successfully!",
        description: `Quote #${result.quote?.id || 'N/A'} has been saved`,
      });
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting the quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">New Shipment Quote</h1>
        <p className="mt-2 text-muted-foreground">
          Calculate your freight quote, review the details, and submit when ready
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <QuoteForm onCalculate={handleQuoteCalculate} />
        {quoteResult && (
          <QuoteResult 
            breakdown={quoteResult} 
            onSubmit={handleQuoteSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default QuoteFormPage;