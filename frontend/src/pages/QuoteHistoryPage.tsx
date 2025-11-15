import QuoteHistoryTable from "@/components/Quote/QuoteHistoryTable";

const QuoteHistoryPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Quote History</h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage all your shipment quotes in one place
        </p>
      </div>

      <QuoteHistoryTable />
    </div>
  );
};

export default QuoteHistoryPage;
