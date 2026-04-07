import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, CheckCircle, AlertCircle } from "lucide-react";

const sampleRows = [
  { file: "registration_001.pdf", vehicle: "KA-01-AB-1234", engine: "ENG20240012", owner: "Rajesh Kumar", status: "success" },
  { file: "registration_002.pdf", vehicle: "KA-02-CD-5678", engine: "ENG20240034", owner: "Priya Sharma", status: "success" },
  { file: "registration_003.pdf", vehicle: "MH-12-EF-9012", engine: "ENG20240056", owner: "Amit Patel", status: "success" },
  { file: "insurance_001.pdf", vehicle: "DL-05-GH-3456", engine: "ENG20240078", owner: "Sunita Devi", status: "success" },
  { file: "title_002.pdf", vehicle: "—", engine: "—", owner: "—", status: "failed" },
  { file: "insurance_002.docx", vehicle: "TN-09-IJ-7890", engine: "ENG20240090", owner: "Vikram Singh", status: "success" },
];

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground text-sm">Vehicle Registration Batch 13</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download Excel
        </Button>
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
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Engine Number</TableHead>
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{row.file}</TableCell>
                    <TableCell className="text-sm">{row.vehicle}</TableCell>
                    <TableCell className="text-sm">{row.engine}</TableCell>
                    <TableCell className="text-sm">{row.owner}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "success" ? "default" : "destructive"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
