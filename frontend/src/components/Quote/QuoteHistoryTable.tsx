import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface Quote {
  id: string;
  lane: string;
  equipmentType: string;
  weight: number;
  total: number;
  createdAt: string;
  status: "active" | "expired" | "booked";
}

// TODO: Replace with actual API call to fetch quotes
const mockQuotes: Quote[] = [
  {
    id: "Q-2024-001",
    lane: "Los Angeles, CA → New York, NY",
    equipmentType: "Dry Van",
    weight: 20000,
    total: 3500,
    createdAt: "2024-01-15",
    status: "booked",
  },
  {
    id: "Q-2024-002",
    lane: "Chicago, IL → Miami, FL",
    equipmentType: "Reefer",
    weight: 15000,
    total: 2800,
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: "Q-2024-003",
    lane: "Houston, TX → Seattle, WA",
    equipmentType: "Flatbed",
    weight: 30000,
    total: 4200,
    createdAt: "2024-01-05",
    status: "expired",
  },
];

const QuoteHistoryTable = () => {
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // TODO: Implement actual filtering logic with backend API
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.lane.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEquipment =
      filterEquipment === "all" || quote.equipmentType === filterEquipment;
    const matchesStatus = filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesEquipment && matchesStatus;
  });

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "booked":
        return "bg-primary";
      case "expired":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quote History</CardTitle>
        <CardDescription>View and filter your previous shipment quotes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by lane or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterEquipment">Equipment Type</Label>
            <Select value={filterEquipment} onValueChange={setFilterEquipment}>
              <SelectTrigger id="filterEquipment">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="Dry Van">Dry Van</SelectItem>
                <SelectItem value="Reefer">Reefer</SelectItem>
                <SelectItem value="Flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterStatus">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filterStatus">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Lane</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No quotes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.lane}</TableCell>
                    <TableCell>{quote.equipmentType}</TableCell>
                    <TableCell>{quote.weight.toLocaleString()} lbs</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(quote.total)}
                    </TableCell>
                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteHistoryTable;
