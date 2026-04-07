import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Download, RotateCcw } from "lucide-react";

const sessions = [
  { id: 1, name: "Vehicle Registration Batch 13", model: "LLaMA 3", files: 51, success: 48, status: "completed", date: "2026-04-07" },
  { id: 2, name: "Vehicle Registration Batch 12", model: "Mistral", files: 45, success: 45, status: "completed", date: "2026-04-06" },
  { id: 3, name: "Insurance Claims Q1", model: "Mixtral", files: 128, success: 120, status: "completed", date: "2026-04-05" },
  { id: 4, name: "Title Deeds March", model: "LLaMA 3", files: 32, success: 32, status: "completed", date: "2026-04-04" },
  { id: 5, name: "License Renewals", model: "Mistral", files: 67, success: 52, status: "error", date: "2026-04-03" },
  { id: 6, name: "Court Orders Feb", model: "LLaMA 3", files: 23, success: 23, status: "completed", date: "2026-03-28" },
];

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Session History</h2>
        <p className="text-muted-foreground text-sm">View and manage all previous extraction sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Success</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-sm">{s.name}</TableCell>
                    <TableCell className="text-sm">{s.model}</TableCell>
                    <TableCell className="text-sm">{s.files}</TableCell>
                    <TableCell className="text-sm">{s.success}/{s.files}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "completed" ? "default" : "destructive"}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/results")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        {s.status === "error" && (
                          <Button variant="ghost" size="icon" onClick={() => navigate("/processing")}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
