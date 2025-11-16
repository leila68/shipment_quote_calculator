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

interface QuoteFormData {
  originCity: string;
  destinationCity: string;
  equipmentType: string;
  totalWeight: string;
  pickupDate: string;
}

interface QuoteFormProps {
  onSubmit: (data: any) => void;
}

interface Lane {
  id: number;
  origin_city: string;
  destination_city: string;
  origin_province: string;
  destination_province: string;
}

const QuoteForm = ({ onSubmit }: QuoteFormProps) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    originCity: "",
    destinationCity: "",
    equipmentType: "",
    totalWeight: "",
    pickupDate: "",
  });
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLanes();
  }, []);

  const fetchLanes = async () => {
    try {
      const response = await fetch("/api/quotes/meta/lanes");
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
    
    // Remove duplicates based on city name
    const uniqueCities = Array.from(
      new Map(cities.map(item => [item.city, item])).values()
    );
    
    return uniqueCities.sort((a, b) => a.city.localeCompare(b.city));
  };

  const getAvailableDestinations = () => {
    if (!formData.originCity) {
      return getUniqueCities("destination");
    }
    
    // Filter destinations based on selected origin
    const availableLanes = lanes.filter(
      (lane) => lane.origin_city === formData.originCity
    );
    
    return availableLanes.map((lane) => ({
      city: lane.destination_city,
      province: lane.destination_province,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/quotes", {
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
      console.log("Quote result:", result);

      onSubmit(result);
    } catch (error) {
      console.error("Error calculating quote:", error);
      alert("An error occurred while calculating the quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => {
      // Reset destination if origin changes
      if (field === "originCity") {
        return { ...prev, [field]: value, destinationCity: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const originCities = getUniqueCities("origin");
  const destinationCities = getAvailableDestinations();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request a Shipment Quote</CardTitle>
        <CardDescription>
          Fill in the details below to get an instant freight quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
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
