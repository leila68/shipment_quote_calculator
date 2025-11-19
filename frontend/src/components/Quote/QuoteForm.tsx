import { useState, useEffect } from "react";
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
import { Calendar, Loader2 } from "lucide-react";
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

interface QuoteFormProps {
  onCalculate: (data: any) => void;
}

interface Lane {
  id: number;
  origin_city: string;
  destination_city: string;
  origin_province: string;
  destination_province: string;
}

const QuoteForm = ({ onCalculate }: QuoteFormProps) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    originCity: "",
    destinationCity: "",
    equipmentType: "",
    totalWeight: "",
    pickupDate: "",
    accessorials: {
      liftgate: false,
      appointment: false,
      residential: false,
    },
  });
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchLanes();
  }, []);

  const fetchLanes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes/meta/lanes`);
      if (!response.ok) {
        throw new Error("Failed to fetch lanes");
      }
      const data = await response.json();
      if (data.success) {
        setLanes(data.lanes);
      }
    } catch (error) {
      console.error("Error fetching lanes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCities = (type: "origin" | "destination") => {
    const cities = lanes.map((lane) => ({
      city: type === "origin" ? lane.origin_city : lane.destination_city,
      province: type === "origin" ? lane.origin_province : lane.destination_province,
    }));
    
    const uniqueCities = Array.from(
      new Map(cities.map(item => [item.city, item])).values()
    );
    
    return uniqueCities.sort((a, b) => a.city.localeCompare(b.city));
  };

  const getAvailableDestinations = () => {
    if (!formData.originCity) {
      return getUniqueCities("destination");
    }
    
    const availableLanes = lanes.filter(
      (lane) => lane.origin_city === formData.originCity
    );
    
    return availableLanes.map((lane) => ({
      city: lane.destination_city,
      province: lane.destination_province,
    }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    try {
      // Call a new endpoint that only calculates without saving
      const response = await fetch(`${API_BASE_URL}/quotes/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate quote");
      }

      const result = await response.json();
      console.log("Quote calculation:", result);

      // Pass both the calculation result and the form data
      onCalculate({
        calculation: result,
        formData: formData
      });
    } catch (error) {
      console.error("Error calculating quote:", error);
      alert("An error occurred while calculating the quote. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => {
      if (field === "originCity") {
        return { ...prev, [field]: value, destinationCity: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleAccessoryChange = (accessory: keyof QuoteFormData["accessorials"], checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      accessorials: {
        ...prev.accessorials,
        [accessory]: checked,
      },
    }));
  };

  const originCities = getUniqueCities("origin");
  const destinationCities = getAvailableDestinations();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request a Shipment Quote</CardTitle>
        <CardDescription>
          Fill in the details below to calculate your freight quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="originCity">Origin City</Label>
                <Select
                  value={formData.originCity}
                  onValueChange={(value) => handleInputChange("originCity", value)}
                  required
                >
                  <SelectTrigger id="originCity">
                    <SelectValue placeholder="Select origin city" />
                  </SelectTrigger>
                  <SelectContent>
                    {originCities.map((city) => (
                      <SelectItem key={city.city} value={city.city}>
                        {city.city}, {city.province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationCity">Destination City</Label>
                <Select
                  value={formData.destinationCity}
                  onValueChange={(value) => handleInputChange("destinationCity", value)}
                  required
                  disabled={!formData.originCity}
                >
                  <SelectTrigger id="destinationCity">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCities.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Select origin first
                      </SelectItem>
                    ) : (
                      destinationCities.map((city) => (
                        <SelectItem key={city.city} value={city.city}>
                          {city.city}, {city.province}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="dry_van">Dry Van</SelectItem>
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

            <div className="space-y-4">
              <h4 className="font-bold">Accessories</h4>
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessorials.liftgate}
                    onChange={(e) => handleAccessoryChange("liftgate", e.target.checked)}
                  />
                  Liftgate Service ($15)
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessorials.appointment}
                    onChange={(e) => handleAccessoryChange("appointment", e.target.checked)}
                  />
                  Scheduled Delivery ($20)
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessorials.residential}
                    onChange={(e) => handleAccessoryChange("residential", e.target.checked)}
                  />
                  Residential Delivery ($25)
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={calculating}>
              {calculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Quote"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteForm;