import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Plus, FileText, CheckCircle, BarChart3, Clock } from "lucide-react";

const recentSessions = [
  { id: 1, name: "Vehicle Registration Batch 12", files: 45, status: "completed", date: "2026-04-07" },
  { id: 2, name: "Insurance Claims Q1", files: 128, status: "processing", date: "2026-04-06" },
  { id: 3, name: "Title Deeds March", files: 32, status: "completed", date: "2026-04-05" },
  { id: 4, name: "License Renewals", files: 67, status: "error", date: "2026-04-04" },
];

const statusVariant = (s: string) =>
  s === "completed" ? "default" : s === "processing" ? "secondary" : "destructive";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground text-sm">Overview of your document extraction pipeline</p>
        </div>
        <Button onClick={() => navigate("/new-session")}>
          <Plus className="mr-2 h-4 w-4" /> New Session
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sessions" value={24} icon={BarChart3} description="+3 this week" />
        <StatCard title="Files Processed" value="1,247" icon={FileText} description="Across all sessions" />
        <StatCard title="Success Rate" value="96.4%" icon={CheckCircle} description="Last 30 days" />
        <StatCard title="Avg. Processing" value="2.3s" icon={Clock} description="Per document" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => navigate("/results")}
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{session.name}</p>
                    <p className="text-xs text-muted-foreground">{session.files} files · {session.date}</p>
                  </div>
                </div>
                <Badge variant={statusVariant(session.status)}>{session.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
