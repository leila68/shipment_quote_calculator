import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, Weight, Truck, Fuel, Loader2, CheckCircle2 } from "lucide-react";

interface QuoteBreakdown {
  baseRate: number;
  equipmentMultiplier: number;
  weightFactor: number;
  fuelSurcharge: number;
  total: number;
  lane: string;
  equipmentType: string;
  weight: number;
  liftgate: boolean;
  appointment: boolean;
  residential: boolean;
}

interface QuoteResultProps {
  breakdown: QuoteBreakdown | null;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

const QuoteResult = ({ breakdown, onSubmit, isSubmitting = false, isSubmitted = false }: QuoteResultProps) => {
  if (!breakdown) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <DollarSign className="h-6 w-6 text-primary" />
          Total Quote: {formatCurrency(breakdown.total)}
        </CardTitle>
        <CardDescription>
          Lane: {breakdown.lane} | Equipment: {breakdown.equipmentType}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Base Rate:
          </span>
          <span>{formatCurrency(breakdown.baseRate)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            Equipment Multiplier:
          </span>
          <span>{breakdown.equipmentMultiplier}x</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Weight className="h-5 w-5 text-muted-foreground" />
            Weight Surcharge:
          </span>
          <span>{formatCurrency(breakdown.weightFactor)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-muted-foreground" />
            Fuel Surcharge:
          </span>
          <span>{formatCurrency(breakdown.fuelSurcharge)}</span>
        </div>
        
        {(breakdown.liftgate || breakdown.appointment || breakdown.residential) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Accessories:</h4>
              {breakdown.liftgate && (
                <div className="flex items-center justify-between text-sm">
                  <span>Liftgate Service:</span>
                  <span>{formatCurrency(15)}</span>
                </div>
              )}
              {breakdown.appointment && (
                <div className="flex items-center justify-between text-sm">
                  <span>Scheduled Delivery:</span>
                  <span>{formatCurrency(20)}</span>
                </div>
              )}
              {breakdown.residential && (
                <div className="flex items-center justify-between text-sm">
                  <span>Residential Delivery:</span>
                  <span>{formatCurrency(25)}</span>
                </div>
              )}
            </div>
          </>
        )}
        
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{formatCurrency(breakdown.total)}</span>
        </div>

        <div className="pt-4">
          {isSubmitted ? (
            <Button className="w-full" size="lg" disabled>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Quote Submitted Successfully
            </Button>
          ) : (
            <Button 
              className="w-full" 
              size="lg" 
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Quote...
                </>
              ) : (
                "Submit Quote"
              )}
            </Button>
          )}
          {!isSubmitted && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Review the details above and submit to save this quote
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteResult;