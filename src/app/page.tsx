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
  // Form state variables
  const [selectedSeedType, setSelectedSeedType] = useState("");
  const [acres, setAcres] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [seedingRate, setSeedingRate] = useState("");
  const [rateType, setRateType] = useState("seeds");
  const [overrideSeeds, setOverrideSeeds] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Function to generate PDF from the result container
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

    const seedsPerLb = overrideSeeds ? parseFloat(overrideSeeds) : parseFloat(seed["Seeds/lb"]);
    const acresNum = parseFloat(acres);
    const seedRateNum = parseFloat(seedingRate);
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
      overrideSeeds,
      result,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white min-h-screen">
      <div className="text-center mb-6">
        <img src="/yms-logo.png" alt="YMS Logo" width={120} height={120} className="mx-auto mb-2" />
        <h1 className="text-4xl font-extrabold text-green-400 tracking-tight">YieldMaster Solutions</h1>
        <p className="text-lg text-zinc-400">Planter Box Treatment Calculator</p>
      </div>

      <div className="flex justify-end">
        <button
          className="text-sm text-zinc-400 hover:text-white border border-zinc-600 px-3 py-1 rounded"
          onClick={() => {
            const root = document.documentElement;
            root.classList.toggle("dark");
          }}
        >
          Toggle Theme
        </button>
      </div>

      <div className="bg-zinc-800 shadow-lg border border-zinc-700 p-4 rounded">
        <div className="mb-4">
          <h2 className="text-green-300 text-xl font-semibold">Calculator Form</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Seed Type</label>
            <select
              value={selectedSeedType}
              onChange={(e) => setSelectedSeedType(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            >
              <option value="">Select Seed Type</option>
              {seedTypes.map((s, i) => (
                <option key={i} value={s["Seed Type"]}>
                  {s["Seed Type"]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">How many acres to be planted?</label>
            <input
              type="number"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            >
              <option value="">Select Product</option>
              {products.map((p, i) => (
                <option
                  key={i}
                  value={`${p["Product Name"]} - ${p["Package Size"]} ${p["Package Units"]} - ${p["Product Packaging"]}`}
                >
                  {`${p["Product Name"]} - ${p["Package Size"]} ${p["Package Units"]} - ${p["Product Packaging"]}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Seeding Rate</label>
            <input
              type="number"
              value={seedingRate}
              onChange={(e) => setSeedingRate(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Rate Type</label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            >
              <option value="seeds">Seeds/Acre</option>
              <option value="lbs">Lbs/Acre</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Override Seeds per Pound (optional)</label>
            {selectedSeedType && (
              <div className="text-sm text-zinc-400 mb-1">
                Default Seeds/lb for {selectedSeedType}:{" "}
                {seedTypes.find((s) => s["Seed Type"] === selectedSeedType)?.["Seeds/lb"]}
              </div>
            )}
            <input
              type="number"
              value={overrideSeeds}
              onChange={(e) => setOverrideSeeds(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div className="md:col-span-2 text-center">
            <button
              type="button"
              onClick={calculate}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full text-lg"
            >
              Calculate
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div ref={resultRef} className="mt-6 border border-green-400 bg-zinc-800 text-white shadow-lg rounded p-4">
          <h2 className="text-center text-2xl font-semibold text-green-300 mb-4">
            Calculation Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result).map(([label, value], i) => (
              <div key={i} className="bg-zinc-900 rounded-xl p-3 border border-zinc-700">
                <strong className="text-green-400 block text-sm mb-1">{label}</strong>
                <span className="text-lg font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="text-center my-4">
            <button
              onClick={downloadPDF}
              className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-full text-white"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
