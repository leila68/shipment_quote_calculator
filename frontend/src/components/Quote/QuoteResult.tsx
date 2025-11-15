import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, Weight, Truck } from "lucide-react";

interface QuoteBreakdown {
  baseRate: number;
  equipmentMultiplier: number;
  weightFactor: number;
  total: number;
  lane: string;
  equipmentType: string;
  weight: number;
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
          Quote Breakdown
        </CardTitle>
        <CardDescription>
          {breakdown.lane} • {breakdown.equipmentType} • {breakdown.weight.toLocaleString()} lbs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Base Rate</span>
            </div>
            <span className="font-medium">{formatCurrency(breakdown.baseRate)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Equipment Multiplier</span>
            </div>
            <span className="font-medium">{formatCurrency(breakdown.equipmentMultiplier)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Weight className="h-4 w-4" />
              <span>Weight Factor</span>
            </div>
            <span className="font-medium">{formatCurrency(breakdown.weightFactor)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(breakdown.total)}
          </span>
        </div>

        <div className="rounded-lg bg-accent/10 p-3 text-sm text-muted-foreground">
          <p>
            * This is an estimated quote. Final pricing may vary based on actual pickup conditions,
            fuel surcharges, and additional services requested.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteResult;
