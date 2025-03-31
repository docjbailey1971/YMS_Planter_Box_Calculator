// src/app/page.tsx
"use client";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const seedTypes = [
  { "Seed Type": "Alfalfa", "Seeds/lb": "210000", "Seeds/Unit": "10500000", "Lbs/Unit": 50 },
  { "Seed Type": "Barley", "Seeds/lb": "14500", "Seeds/Unit": "725000", "Lbs/Unit": 50 },
  { "Seed Type": "Canola", "Seeds/lb": "130000", "Seeds/Unit": "6500000", "Lbs/Unit": 50 },
  { "Seed Type": "Corn", "Seeds/lb": "1778", "Seeds/Unit": "80000", "Lbs/Unit": 45 },
  { "Seed Type": "Flax", "Seeds/lb": "85000", "Seeds/Unit": "4250000", "Lbs/Unit": 50 },
  { "Seed Type": "Lentils", "Seeds/lb": "16500", "Seeds/Unit": "825000", "Lbs/Unit": 50 },
  { "Seed Type": "Peas", "Seeds/lb": "4000", "Seeds/Unit": "200000", "Lbs/Unit": 50 },
  { "Seed Type": "Sorghum", "Seeds/lb": "15500", "Seeds/Unit": "775000", "Lbs/Unit": 50 },
  { "Seed Type": "Soybeans", "Seeds/lb": "2800", "Seeds/Unit": "140000", "Lbs/Unit": 50 },
  { "Seed Type": "Sugarbeets", "Seeds/lb": "2000", "Seeds/Unit": "100000", "Lbs/Unit": 50 },
  { "Seed Type": "Sunflower", "Seeds/lb": "6500", "Seeds/Unit": "325000", "Lbs/Unit": 50 },
  { "Seed Type": "Peanuts (Medium)", "Seeds/lb": "650", "Seeds/Unit": "32500", "Lbs/Unit": 50 },
  { "Seed Type": "Peanuts (Small)", "Seeds/lb": "1100", "Seeds/Unit": "55000", "Lbs/Unit": 50 },
  { "Seed Type": "Wheat", "Seeds/lb": "18000", "Seeds/Unit": "750000", "Lbs/Unit": 50 }
];

const products = [
  { "Product Name": "DUST Pail", "Package Size": 112.0, "Package Units": "oz", "Product Packaging": "Pails", "Product Cost per Package": "$60.00", "Product Cost per oz": "$1.87", "Application Rate in Ounces": 0.5 },
  { "Product Name": "DUST Pail", "Package Size": 224.0, "Package Units": "oz", "Product Packaging": "Pails", "Product Cost per Package": "$120.00", "Product Cost per oz": "$1.87", "Application Rate in Ounces": 0.5 },
  { "Product Name": "DUST Pouch", "Package Size": 16.0, "Package Units": "oz", "Product Packaging": "Pouches", "Product Cost per Package": "$15.50", "Product Cost per oz": "$0.97", "Application Rate in Ounces": 0.5 },
  { "Product Name": "OmniSync Pail", "Package Size": 320.0, "Package Units": "oz", "Product Packaging": "Pails", "Product Cost per Package": "$952.00", "Product Cost per oz": "$2.98", "Application Rate in Ounces": 2.0 },
  { "Product Name": "Nutriquire + Terrasym450 + DUST Corn", "Package Size": 12.5, "Package Units": "oz", "Product Packaging": "Pouches", "Product Cost per Package": "$882.05", "Product Cost per oz": "$70.56", "Application Rate in Ounces": 0.5 },
  { "Product Name": "Nutriquire + Terrasym401 + DUST Soybean", "Package Size": 20.0, "Package Units": "oz", "Product Packaging": "Pouches", "Product Cost per Package": "$598.00", "Product Cost per oz": "$29.90", "Application Rate in Ounces": 0.5 },
  { "Product Name": "Terrasym 450 + DUST + TS201 for Corn Root Worm", "Package Size": 25.0, "Package Units": "oz", "Product Packaging": "Pouches", "Product Cost per Package": "$1,740.50", "Product Cost per oz": "$69.62", "Application Rate in Ounces": 0.5 }
];

// Helper function to format numbers
function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface CalculationResult {
  [key: string]: string | number;
}

export default function Home() {
  const [selectedSeedType, setSelectedSeedType] = useState("");
  const [acres, setAcres] = useState<number | "">("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [seedingRate, setSeedingRate] = useState<number | "">("");
  const [seedOverride, setSeedOverride] = useState<number | "">("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!resultRef.current) return;
    html2canvas(resultRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      pdf.save("YieldMaster_Calculation.pdf");
    });
  };

  // Calculation logic – adjust formulas as needed
  const calculate = () => {
    const seed = seedTypes.find((s) => s["Seed Type"] === selectedSeedType);
    const prod = products.find((p) => p["Product Name"] === selectedProduct);
    if (!seed || !prod || !acres || !seedingRate) return;

    const seedsPerLb = seedOverride ? parseFloat(seedOverride.toString()) : parseFloat(seed["Seeds/lb"]);
    const acresNum = typeof acres === "number" ? acres : 0;
    const seedRateNum = typeof seedingRate === "number" ? seedingRate : 0;
    const seedsPerUnit = parseFloat(seed["Seeds/Unit"]);
    const lbsPerUnit = seed["Lbs/Unit"];
    const appRate = prod["Application Rate in Ounces"];
    const costPerOz = parseFloat(prod["Product Cost per oz"].replace(/[^\d.-]/g, ""));
    const costPerPackage = parseFloat(prod["Product Cost per Package"].replace(/[^\d.-]/g, ""));
    const packageSize = prod["Package Size"];

    const totalSeeds = acresNum * seedRateNum;
    const totalWeight = totalSeeds / seedsPerLb;
    const totalUnits = totalWeight / lbsPerUnit;
    const totalProductOz = totalUnits * appRate;
    const totalPackages = Math.ceil(totalProductOz / packageSize);

    const costPerUnit = costPerOz * appRate;
    const costPerAcre = (costPerUnit * totalUnits) / acresNum;
    const totalGrowerCost = totalPackages * costPerPackage;

    setResult({
      "Total Number of Seeds to be Treated": formatNumber(Math.round(totalSeeds)),
      "Total Weight of Seeds to be Treated": formatNumber(totalWeight),
      "Total Number of Units to be Treated": formatNumber(totalUnits),
      "Number of Seeds per Unit": formatNumber(seedsPerUnit),
      "Application Rate": `${formatNumber(appRate, 2)} oz per unit of seed`,
      "Total Amount of Product Needed": `${formatNumber(totalProductOz, 2)} oz`,
      "Total Number of Product Packages": `${formatNumber(totalPackages)} ${prod["Product Packaging"].toLowerCase()}`,
      "Product Cost per Package": `$${formatNumber(costPerPackage, 2)}`,
      "Total Cost to the Grower": `$${formatNumber(totalGrowerCost, 2)}`,
      "Product Cost per Ounce": `$${formatNumber(costPerOz, 2)}`,
      "Product Cost per Unit of Treated Seed": `$${formatNumber(costPerUnit, 2)}`,
      "Product Cost per Acre": `$${formatNumber(costPerAcre, 2)}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
    console.log({
      selectedSeedType,
      acres,
      selectedProduct,
      seedingRate,
      seedOverride,
      result,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">YMS Planter Box Calculator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Seed Type"
            value={selectedSeedType}
            onChange={(e) => setSelectedSeedType(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700"
          />
          <input
            type="number"
            placeholder="Acres"
            value={acres}
            onChange={(e) => setAcres(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 border border-gray-700"
          />
          <input
            type="text"
            placeholder="Product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700"
          />
          <input
            type="number"
            placeholder="Seeding Rate"
            value={seedingRate}
            onChange={(e) => setSeedingRate(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 border border-gray-700"
          />
          <input
            type="number"
            placeholder="Seed Override"
            value={seedOverride}
            onChange={(e) => setSeedOverride(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 border border-gray-700"
          />
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
            Calculate
          </button>
        </form>
        {result && (
          <div ref={resultRef} className="mt-8 p-4 bg-gray-800 rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-4 py-2 text-left">Metric</th>
                  <th className="px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-600">
                    <td className="px-4 py-2 text-white">{key}</td>
                    <td className="px-4 py-2 text-white">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={downloadPDF}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
