import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sampleRows = [
  { file: "registration_001.pdf", vehicle: "KA-01-AB-1234", engine: "ENG20240012", owner: "Rajesh Kumar", status: "success" },
  { file: "registration_002.pdf", vehicle: "KA-02-CD-5678", engine: "ENG20240034", owner: "Priya Sharma", status: "success" },
  { file: "registration_003.pdf", vehicle: "MH-12-EF-9012", engine: "ENG20240056", owner: "Amit Patel", status: "success" },
  { file: "insurance_001.pdf", vehicle: "DL-05-GH-3456", engine: "ENG20240078", owner: "Sunita Devi", status: "success" },
  { file: "title_002.pdf", vehicle: "—", engine: "—", owner: "—", status: "failed" },
  { file: "insurance_002.docx", vehicle: "TN-09-IJ-7890", engine: "ENG20240090", owner: "Vikram Singh", status: "success" },
  { file: "registration_004.pdf", vehicle: "AP-28-KL-2345", engine: "ENG20240101", owner: "Meena Reddy", status: "success" },
  { file: "registration_005.pdf", vehicle: "GJ-01-MN-6789", engine: "ENG20240115", owner: "Kiran Shah", status: "success" },
];

const columns = ["File", "Vehicle Number", "Engine Number", "Owner Name", "Status"];

export default function ResultsPage() {
  const handleExport = (format: string) => {
    // Placeholder export logic
    const csvContent = [
      columns.join(","),
      ...sampleRows.map((r) =>
        [r.file, r.vehicle, r.engine, r.owner, r.status].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: format === "csv" ? "text/csv" : "text/tab-separated-values",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extraction_results.${format === "csv" ? "csv" : "tsv"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground text-sm">Vehicle Registration Batch 13</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("tsv")}>
              Export as TSV (Excel-compatible)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Files" value={51} icon={FileText} />
        <StatCard title="Successful" value={48} icon={CheckCircle} description="94.1% success rate" />
        <StatCard title="Failed" value={3} icon={AlertCircle} description="Require review" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Extracted Data Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 bg-muted px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-r last:border-r-0">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="sticky top-0 z-10 bg-muted px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-r last:border-r-0"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-b-0 hover:bg-accent/40 transition-colors"
                  >
                    <td className="px-4 py-2 border-r text-muted-foreground tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2 border-r font-medium">{row.file}</td>
                    <td className="px-4 py-2 border-r font-mono text-xs">{row.vehicle}</td>
                    <td className="px-4 py-2 border-r font-mono text-xs">{row.engine}</td>
                    <td className="px-4 py-2 border-r">{row.owner}</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={row.status === "success" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
