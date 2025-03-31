// app/page.tsx
"use client";
import { useState } from 'react';

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

export default function Home() {
  const [selectedSeedType, setSelectedSeedType] = useState("");
  const [acres, setAcres] = useState<number | ''>('');
  const [selectedProduct, setSelectedProduct] = useState("");
  const [seedingRate, setSeedingRate] = useState<number | ''>('');
  const [seedOverride, setSeedOverride] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration point for calculation logic
    console.log({
      selectedSeedType,
      acres,
      selectedProduct,
      seedingRate,
      seedOverride
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">YMS Planter Box Calculator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seed Type Dropdown */}
          <div>
            <label className="block mb-1" htmlFor="seedType">Seed Type</label>
            <select
              id="seedType"
              value={selectedSeedType}
              onChange={(e) => setSelectedSeedType(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a seed type</option>
              {seedTypes.map((seed, index) => (
                <option key={index} value={seed["Seed Type"]}>
                  {seed["Seed Type"]}
                </option>
              ))}
            </select>
          </div>
          {/* Acres Input */}
          <div>
            <label className="block mb-1" htmlFor="acres">Number of Acres</label>
            <input
              id="acres"
              type="number"
              value={acres}
              onChange={(e) => setAcres(e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of acres"
            />
          </div>
          {/* Product Dropdown */}
          <div>
            <label className="block mb-1" htmlFor="product">Product Selection</label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product</option>
              {products.map((prod, index) => (
                <option key={index} value={prod["Product Name"]}>
                  {prod["Product Name"]}
                </option>
              ))}
            </select>
          </div>
          {/* Seeding Rate Input */}
          <div>
            <label className="block mb-1" htmlFor="seedingRate">Seeding Rate</label>
            <input
              id="seedingRate"
              type="number"
              value={seedingRate}
              onChange={(e) => setSeedingRate(e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter seeding rate"
            />
          </div>
          {/* Seed Override Input */}
          <div>
            <label className="block mb-1" htmlFor="seedOverride">Seed Override (seeds per lb)</label>
            <input
              id="seedOverride"
              type="number"
              value={seedOverride}
              onChange={(e) => setSeedOverride(e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter seed override"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            Calculate
          </button>
        </form>
      </div>
    </div>
  );
}
