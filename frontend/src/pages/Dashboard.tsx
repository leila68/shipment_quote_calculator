import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config/api";

interface DashboardStats {
  totalQuotes: number;
  totalSpent: number;
  activeShipments: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    totalSpent: 0,
    activeShipments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all quotes to calculate stats
      const response = await fetch(`${API_BASE_URL}/quotes?limit=1000`);
      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }
      const data = await response.json();

      if (data.success && data.data) {
        const quotes = data.data;
        
        // Calculate total spent
        const totalSpent = quotes.reduce((sum: number, quote: any) => {
          return sum + (quote.total_quote || 0);
        }, 0);

        // Count active shipments (quotes with status 'sent' or 'accepted')
        const activeShipments = quotes.filter(
          (quote: any) => quote.status === 'sent' || quote.status === 'accepted'
        ).length;

        setStats({
          totalQuotes: data.pagination.total,
          totalSpent: totalSpent,
          activeShipments: activeShipments,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Quotes",
      value: loading ? "..." : stats.totalQuotes.toString(),
      icon: Package,
      description: "All time quotes",
      trend: "neutral",
    },
    {
      title: "Active Shipments",
      value: loading ? "..." : stats.activeShipments.toString(),
      icon: TrendingUp,
      description: "Sent or accepted",
      trend: "neutral",
    },
    {
      title: "Total Spent",
      value: loading ? "..." : `$${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "All time total",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's an overview of your shipping activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Get a New Quote</CardTitle>
            <CardDescription>
              Calculate shipping costs for your next freight delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quote">
              <Button className="w-full" size="lg">
                Create New Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>View Quote History</CardTitle>
            <CardDescription>
              Access and manage all your previous shipping quotes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/history">
              <Button variant="outline" className="w-full" size="lg">
                View All Quotes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
