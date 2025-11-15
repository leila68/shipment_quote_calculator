import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface QuoteFormData {
  originCity: string;
  destinationCity: string;
  equipmentType: string;
  totalWeight: string;
  pickupDate: string;
}

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
}

const QuoteForm = ({ onSubmit }: QuoteFormProps) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    originCity: "",
    destinationCity: "",
    equipmentType: "",
    totalWeight: "",
    pickupDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation
    // TODO: Call backend API endpoint for quote calculation
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request a Shipment Quote</CardTitle>
        <CardDescription>
          Fill in the details below to get an instant freight quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="originCity">Origin City</Label>
              <Input
                id="originCity"
                placeholder="e.g., Los Angeles, CA"
                value={formData.originCity}
                onChange={(e) => handleInputChange("originCity", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationCity">Destination City</Label>
              <Input
                id="destinationCity"
                placeholder="e.g., New York, NY"
                value={formData.destinationCity}
                onChange={(e) => handleInputChange("destinationCity", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="equipmentType">Equipment Type</Label>
              <Select
                value={formData.equipmentType}
                onValueChange={(value) => handleInputChange("equipmentType", value)}
                required
              >
                <SelectTrigger id="equipmentType">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry-van">Dry Van</SelectItem>
                  <SelectItem value="reefer">Reefer (Refrigerated)</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalWeight">Total Weight (lbs)</Label>
              <Input
                id="totalWeight"
                type="number"
                placeholder="e.g., 20000"
                value={formData.totalWeight}
                onChange={(e) => handleInputChange("totalWeight", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <div className="relative">
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Calculate Quote
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;
