import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, Weight, Truck, Fuel } from "lucide-react";

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
}

const QuoteResult = ({ breakdown }: QuoteResultProps) => {
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
      <CardContent className="space-y-4">
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
          <span>{breakdown.equipmentMultiplier}</span>
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
        <Separator />
        <div className="space-y-2">
          <h4 className="font-bold">Accessories:</h4>
          {breakdown.liftgate && (
            <div className="flex items-center justify-between">
              <span>Liftgate Service:</span>
              <span>{formatCurrency(15)}</span>
            </div>
          )}
          {breakdown.appointment && (
            <div className="flex items-center justify-between">
              <span>Scheduled Delivery:</span>
              <span>{formatCurrency(20)}</span>
            </div>
          )}
          {breakdown.residential && (
            <div className="flex items-center justify-between">
              <span>Residential Delivery:</span>
              <span>{formatCurrency(25)}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center justify-between font-bold">
          <span>Total:</span>
          <span>{formatCurrency(breakdown.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteResult;
