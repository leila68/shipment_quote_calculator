import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from "@/config/api";

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
  const { toast } = useToast();

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quotes?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }
      const data = await response.json();
      
      if (data.success) {
        setQuotes(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
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

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "success" } = {
      created: "secondary",
      sent: "default",
      accepted: "success",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatEquipmentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && quotes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!loading && quotes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No quotes found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first quote to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Quotes</CardTitle>
        <CardDescription>
          View and manage all your shipment quotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Weight (lbs)</TableHead>
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
                  <TableCell className="font-medium">#{quote.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {quote.origin_city} → {quote.destination_city}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {quote.distance_km} km • {quote.transit_days}{" "}
                        {quote.transit_days === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatEquipmentType(quote.equipment_type)}</TableCell>
                  <TableCell>{quote.total_weight.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(quote.pickup_date)}</TableCell>
                  <TableCell className="font-semibold">
                    ${quote.total_quote.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(quote.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteHistoryTable;
