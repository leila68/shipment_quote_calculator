import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from "@/config/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Quote {
  id: number;
  origin_city: string;
  destination_city: string;
  equipment_type: string;
  total_weight: number;
  pickup_date: string;
  total_quote: number;
  status: string;
  created_at: string;
  distance_km: number;
  transit_days: number;
}

const QuoteHistoryTable = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    equipment: "",
    date: "",
  });

  const { toast } = useToast();

  const handleEquipmentChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      equipment: value
    }));
  };

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        originCity: filters.origin,
        destinationCity: filters.destination,
        equipmentType: filters.equipment,
        startDate: filters.date,
        endDate: filters.date, // backend treats same date as single date filter
      });

      const response = await fetch(`${API_BASE_URL}/quotes?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch quotes");

      const data = await response.json();
      if (data.success) {
        setQuotes(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load quote history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchQuotes();
  };

  const resetFilters = () => {
    setFilters({ origin: "", destination: "", equipment: "", date: "" });
    setPage(1);
    fetchQuotes();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success"> = {
      created: "secondary",
      sent: "default",
      accepted: "success",
    };
    return <Badge variant={variants[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Quotes</CardTitle>
        <CardDescription>View and manage all your shipment quotes</CardDescription>
      </CardHeader>

      <CardContent>
        {/* FILTER BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="origin-filter">Origin City</Label>
            <Input placeholder="Origin city" value={filters.origin} onChange={(e) => handleFilterChange("origin", e.target.value)} />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="destination-filter">Destination City</Label>
            <Input placeholder="Destination city" value={filters.destination} onChange={(e) => handleFilterChange("destination", e.target.value)} />
          </div>
          <div className="space-y-2 flex flex-col"> {/* Add flex flex-col */}
            <Label htmlFor="equipment-filter">Equipment</Label>
            <Select value={filters.equipment} onValueChange={handleEquipmentChange}>
              <SelectTrigger id="equipment-filter">
                <SelectValue placeholder="Select equipment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry_van">Dry Van</SelectItem>
                <SelectItem value="flatbed">Flatbed</SelectItem>
                <SelectItem value="reefer">Reefer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="date-filter">Date</Label>
            <Input type="date" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)} />
          </div>

          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={() => setFilters({
            origin: "",
            destination: "",
            equipment: "", // Add this line
            date: "",
          })}>Reset</Button>
        </div>

        {/* LOADING STATE */}
        {loading && quotes.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && quotes.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No quotes found</div>
        )}

        {/* TABLE */}
        {quotes.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Pickup Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>#{quote.id}</TableCell>
                    <TableCell>{quote.origin_city} → {quote.destination_city}</TableCell>
                    <TableCell>{quote.equipment_type}</TableCell>
                    <TableCell>{quote.total_weight}</TableCell>
                    <TableCell>{formatDate(quote.pickup_date)}</TableCell>
                    <TableCell>${quote.total_quote.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell>{formatDate(quote.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>Next</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteHistoryTable;
