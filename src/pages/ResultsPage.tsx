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

interface ExtractionRow {
  srNo: number;
  vcNumber: string;
  vehicleDescription: string;
  baseVc: string;
  vehicleDetails: string;
  noOfGears: string;
  wheelBase: string;
  maxSpeed: string;
  abs: string;
  pedalForce: string;
  lrBalanceFront: string;
  cruiseControl: string;
  normalBrakeForeFront: string;
  normalBrakeForceRear: string;
  wheelDragForceFront: string;
  wheelDragForceRear: string;
  parkingBrakeForce: string;
  addedBy: string;
  date: string;
  status: "success" | "failed";
  sourceFile: string;
}

const sampleRows: ExtractionRow[] = [
  {
    srNo: 1,
    vcNumber: "VC-2024-001",
    vehicleDescription: "Tata Nexon EV Max",
    baseVc: "BVC-NEX-001",
    vehicleDetails: "12V",
    noOfGears: "1 (Single Speed)",
    wheelBase: "2498 mm",
    maxSpeed: "120",
    abs: "Yes",
    pedalForce: "245",
    lrBalanceFront: "60/40",
    cruiseControl: "Yes",
    normalBrakeForeFront: "3800",
    normalBrakeForceRear: "2100",
    wheelDragForceFront: "180",
    wheelDragForceRear: "120",
    parkingBrakeForce: "4500",
    addedBy: "R. Sharma",
    date: "2026-04-07",
    status: "success",
    sourceFile: "brake_test_batch_01_VC001.pdf",
  },
  {
    srNo: 2,
    vcNumber: "VC-2024-002",
    vehicleDescription: "Mahindra XUV700 AWD",
    baseVc: "BVC-XUV-002",
    vehicleDetails: "12V",
    noOfGears: "6",
    wheelBase: "2750 mm",
    maxSpeed: "200",
    abs: "Yes",
    pedalForce: "310",
    lrBalanceFront: "58/42",
    cruiseControl: "Yes",
    normalBrakeForeFront: "4200",
    normalBrakeForceRear: "2600",
    wheelDragForceFront: "210",
    wheelDragForceRear: "145",
    parkingBrakeForce: "5200",
    addedBy: "A. Patel",
    date: "2026-04-07",
    status: "success",
    sourceFile: "brake_test_batch_01_VC002.pdf",
  },
  {
    srNo: 3,
    vcNumber: "VC-2024-003",
    vehicleDescription: "Ashok Leyland BOSS 1615",
    baseVc: "BVC-AL-003",
    vehicleDetails: "24V",
    noOfGears: "9",
    wheelBase: "4200 mm",
    maxSpeed: "95",
    abs: "Yes",
    pedalForce: "520",
    lrBalanceFront: "35/65",
    cruiseControl: "No",
    normalBrakeForeFront: "8500",
    normalBrakeForceRear: "12000",
    wheelDragForceFront: "380",
    wheelDragForceRear: "540",
    parkingBrakeForce: "14000",
    addedBy: "V. Reddy",
    date: "2026-04-06",
    status: "success",
    sourceFile: "brake_test_batch_01_VC003.pdf",
  },
  {
    srNo: 4,
    vcNumber: "VC-2024-004",
    vehicleDescription: "TATA Signa 4825.TK",
    baseVc: "BVC-TSG-004",
    vehicleDetails: "24V",
    noOfGears: "12",
    wheelBase: "5200 mm",
    maxSpeed: "80",
    abs: "Yes",
    pedalForce: "680",
    lrBalanceFront: "28/72",
    cruiseControl: "No",
    normalBrakeForeFront: "10200",
    normalBrakeForceRear: "18500",
    wheelDragForceFront: "450",
    wheelDragForceRear: "820",
    parkingBrakeForce: "21000",
    addedBy: "S. Kumar",
    date: "2026-04-06",
    status: "success",
    sourceFile: "brake_test_batch_01_VC004.pdf",
  },
  {
    srNo: 5,
    vcNumber: "VC-2024-005",
    vehicleDescription: "Maruti Suzuki Swift VXi",
    baseVc: "BVC-MSW-005",
    vehicleDetails: "12V",
    noOfGears: "5",
    wheelBase: "2450 mm",
    maxSpeed: "175",
    abs: "Yes",
    pedalForce: "195",
    lrBalanceFront: "62/38",
    cruiseControl: "No",
    normalBrakeForeFront: "3100",
    normalBrakeForceRear: "1800",
    wheelDragForceFront: "140",
    wheelDragForceRear: "95",
    parkingBrakeForce: "3800",
    addedBy: "P. Nair",
    date: "2026-04-05",
    status: "success",
    sourceFile: "brake_test_batch_01_VC005.pdf",
  },
  {
    srNo: 6,
    vcNumber: "VC-2024-006",
    vehicleDescription: "Eicher Pro 6016",
    baseVc: "BVC-EI-006",
    vehicleDetails: "24V",
    noOfGears: "9",
    wheelBase: "4800 mm",
    maxSpeed: "90",
    abs: "—",
    pedalForce: "—",
    lrBalanceFront: "—",
    cruiseControl: "—",
    normalBrakeForeFront: "—",
    normalBrakeForceRear: "—",
    wheelDragForceFront: "—",
    wheelDragForceRear: "—",
    parkingBrakeForce: "—",
    addedBy: "—",
    date: "2026-04-05",
    status: "failed",
    sourceFile: "brake_test_batch_01_VC006_damaged.pdf",
  },
  {
    srNo: 7,
    vcNumber: "VC-2024-007",
    vehicleDescription: "Honda City 5th Gen",
    baseVc: "BVC-HC-007",
    vehicleDetails: "12V",
    noOfGears: "6",
    wheelBase: "2600 mm",
    maxSpeed: "190",
    abs: "Yes",
    pedalForce: "220",
    lrBalanceFront: "61/39",
    cruiseControl: "Yes",
    normalBrakeForeFront: "3500",
    normalBrakeForceRear: "1950",
    wheelDragForceFront: "162",
    wheelDragForceRear: "108",
    parkingBrakeForce: "4100",
    addedBy: "D. Iyer",
    date: "2026-04-04",
    status: "success",
    sourceFile: "brake_test_batch_01_VC007.pdf",
  },
  {
    srNo: 8,
    vcNumber: "VC-2024-008",
    vehicleDescription: "Force Traveller 3350",
    baseVc: "BVC-FT-008",
    vehicleDetails: "12V",
    noOfGears: "5",
    wheelBase: "3350 mm",
    maxSpeed: "110",
    abs: "No",
    pedalForce: "420",
    lrBalanceFront: "45/55",
    cruiseControl: "No",
    normalBrakeForeFront: "5800",
    normalBrakeForceRear: "6200",
    wheelDragForceFront: "260",
    wheelDragForceRear: "280",
    parkingBrakeForce: "8500",
    addedBy: "M. Singh",
    date: "2026-04-04",
    status: "success",
    sourceFile: "brake_test_batch_01_VC008.pdf",
  },
];

const columns = [
  "Sr No",
  "VC Number",
  "Vehicle Description",
  "Base VC",
  "Vehicle Details (12V/24V)",
  "No of Gears",
  "Wheel Base",
  "Max Speed (km/h)",
  "ABS",
  "Pedal Force (N)",
  "L/R Balance % (Front)",
  "Cruise Control",
  "Normal Brake Force Front (N)",
  "Normal Brake Force Rear (N)",
  "Wheel Drag Force Front (N)",
  "Wheel Drag Force Rear (N)",
  "Parking Brake Force (N)",
  "Added By",
  "Date",
];

const rowValues = (row: ExtractionRow): string[] => [
  row.srNo.toString(),
  row.vcNumber,
  row.vehicleDescription,
  row.baseVc,
  row.vehicleDetails,
  row.noOfGears,
  row.wheelBase,
  row.maxSpeed,
  row.abs,
  row.pedalForce,
  row.lrBalanceFront,
  row.cruiseControl,
  row.normalBrakeForeFront,
  row.normalBrakeForceRear,
  row.wheelDragForceFront,
  row.wheelDragForceRear,
  row.parkingBrakeForce,
  row.addedBy,
  row.date,
];

export default function ResultsPage() {
  const successCount = sampleRows.filter((r) => r.status === "success").length;
  const failedCount = sampleRows.filter((r) => r.status === "failed").length;

  const handleExport = (fmt: string) => {
    const sep = fmt === "csv" ? "," : "\t";
    const content = [
      ["Source File", ...columns, "Status"].join(sep),
      ...sampleRows.map((r) =>
        [r.sourceFile, ...rowValues(r), r.status].join(sep)
      ),
    ].join("\n");

    const blob = new Blob([content], {
      type: fmt === "csv" ? "text/csv" : "text/tab-separated-values",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brake_test_extraction.${fmt === "csv" ? "csv" : "tsv"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground text-sm">
            Brake Test Data — Vehicle Certification Batch 2024-01
          </p>
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
        <StatCard title="Total Files" value={sampleRows.length} icon={FileText} />
        <StatCard
          title="Successful"
          value={successCount}
          icon={CheckCircle}
          description={`${((successCount / sampleRows.length) * 100).toFixed(1)}% success rate`}
        />
        <StatCard
          title="Failed"
          value={failedCount}
          icon={AlertCircle}
          description="Require manual review"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Extracted Brake Test Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 bg-muted px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-r whitespace-nowrap">
                    Source File
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="sticky top-0 z-10 bg-muted px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-r last:border-r-0 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="sticky top-0 z-10 bg-muted px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row) => (
                  <tr
                    key={row.srNo}
                    className="border-b last:border-b-0 hover:bg-accent/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 border-r font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {row.sourceFile}
                    </td>
                    {rowValues(row).map((val, i) => (
                      <td
                        key={i}
                        className={`px-4 py-2.5 border-r whitespace-nowrap ${
                          val === "—"
                            ? "text-muted-foreground"
                            : i === 1
                            ? "font-medium"
                            : i === 2
                            ? "font-semibold"
                            : ""
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={
                          row.status === "success" ? "default" : "destructive"
                        }
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
