import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, DollarSign, ArrowRight } from "lucide-react";

const Dashboard = () => {
  // TODO: Replace with actual data from backend API
  const stats = [
    {
      title: "Total Quotes",
      value: "127",
      icon: Package,
      description: "+12% from last month",
      trend: "up",
    },
    {
      title: "Active Shipments",
      value: "8",
      icon: TrendingUp,
      description: "Currently in transit",
      trend: "neutral",
    },
    {
      title: "Total Spent",
      value: "$45,231",
      icon: DollarSign,
      description: "Last 30 days",
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
        {stats.map((stat) => {
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
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
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
