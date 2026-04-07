import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Loader2, AlertCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const folders = [
  { name: "batch-13/registrations", files: 12, status: "completed" },
  { name: "batch-13/insurance", files: 8, status: "completed" },
  { name: "batch-13/titles", files: 15, status: "processing" },
  { name: "batch-13/licenses", files: 10, status: "pending" },
  { name: "batch-13/claims", files: 6, status: "error" },
];

const logLines = [
  "[14:32:01] Session started: Vehicle Registration Batch 13",
  "[14:32:01] Model loaded: LLaMA 3 (8B parameters)",
  "[14:32:02] Processing folder: batch-13/registrations (12 files)",
  "[14:32:05] ✓ registration_001.pdf → extracted 5 fields",
  "[14:32:08] ✓ registration_002.pdf → extracted 5 fields",
  "[14:32:12] ✓ registration_003.pdf → extracted 5 fields",
  "[14:32:15] Folder completed: batch-13/registrations (12/12)",
  "[14:32:16] Processing folder: batch-13/insurance (8 files)",
  "[14:32:19] ✓ insurance_001.pdf → extracted 5 fields",
  "[14:32:22] ✓ insurance_002.docx → extracted 5 fields",
  "[14:32:25] Folder completed: batch-13/insurance (8/8)",
  "[14:32:26] Processing folder: batch-13/titles (15 files)",
  "[14:32:29] ✓ title_001.pdf → extracted 5 fields",
  "[14:32:32] ⟳ title_002.pdf → processing...",
];

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle className="h-4 w-4 text-success" />;
  if (s === "processing") return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
  if (s === "error") return <AlertCircle className="h-4 w-4 text-destructive" />;
  return <FolderOpen className="h-4 w-4 text-muted-foreground" />;
};

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 65 ? 65 : p + 1));
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Processing</h2>
          <p className="text-muted-foreground text-sm">Vehicle Registration Batch 13</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/results")}>
          View Results
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">33 of 51 files processed</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {statusIcon(folder.status)}
                    <div>
                      <p className="text-sm font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.files} files</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      folder.status === "completed"
                        ? "default"
                        : folder.status === "error"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {folder.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] rounded-md border bg-foreground/[0.03] p-3">
              <div className="space-y-1 font-mono text-xs">
                {logLines.map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.includes("✓")
                        ? "text-success"
                        : line.includes("⟳")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {line}
                  </p>
                ))}
                <span className="inline-block w-2 h-3.5 bg-primary animate-pulse" />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
