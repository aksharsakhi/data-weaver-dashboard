import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Play, FolderOpen } from "lucide-react";

export default function NewSessionPage() {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const [model, setModel] = useState("");
  const [fields, setFields] = useState([
    { id: 1, name: "Vehicle Number" },
    { id: 2, name: "Engine Number" },
    { id: 3, name: "Owner Name" },
  ]);
  const [newField, setNewField] = useState("");

  const addField = () => {
    if (!newField.trim()) return;
    setFields([...fields, { id: Date.now(), name: newField.trim() }]);
    setNewField("");
  };

  const removeField = (id: number) => setFields(fields.filter((f) => f.id !== id));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Extraction Session</h2>
        <p className="text-muted-foreground text-sm">Configure and start a new document extraction job</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Configuration</CardTitle>
          <CardDescription>Set up the parameters for this extraction run</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <Input
              id="session-name"
              placeholder="e.g. Vehicle Registration Batch 13"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-path">Folder Path</Label>
            <div className="flex gap-2">
              <Input
                id="folder-path"
                placeholder="/data/documents/batch-13"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama3">LLaMA 3</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
                <SelectItem value="mixtral">Mixtral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Extraction Fields</Label>
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => (
                <span
                  key={field.id}
                  className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {field.name}
                  <button onClick={() => removeField(field.id)} className="hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new field..."
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                className="flex-1"
              />
              <Button variant="outline" onClick={addField}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          <Button
            className="w-full mt-2"
            size="lg"
            onClick={() => navigate("/processing")}
            disabled={!sessionName || !folderPath || !model}
          >
            <Play className="h-4 w-4 mr-2" /> Start Processing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
