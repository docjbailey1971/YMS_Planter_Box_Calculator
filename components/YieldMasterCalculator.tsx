import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

function formatNumber(n: number, decimals = 0) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function YieldMasterCalculator() {
  const [seedType, setSeedType] = useState('');
  const [acres, setAcres] = useState('');
  const [product, setProduct] = useState('');
  const [seedingRate, setSeedingRate] = useState('');
  const [rateType, setRateType] = useState('seeds');
  const [overrideSeeds, setOverrideSeeds] = useState('');
  const [result, setResult] = useState<Record<string, string | number> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (resultRef.current !== null) {
      html2canvas(resultRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.save('YieldMaster_Calculation.pdf');
      });
    }
  };

  const calculate = () => {
    const seed = seedTypes.find((s) => s['Seed Type'] === seedType);
    const prod = products.find(
      (p) => `${p['Product Name']} - ${p['Package Size']} ${p['Package Units']} - ${p['Product Packaging']}` === product
    );
    if (!seed || !prod || !acres || !seedingRate) return;

    const seedsPerLb = overrideSeeds ? parseFloat(overrideSeeds) : parseFloat(seed['Seeds/lb'].toString());
    const acresNum = parseFloat(acres);
    const seedRate = parseFloat(seedingRate);
    const seedsPerUnit = parseFloat(seed['Seeds/Unit'].toString());
    const lbsPerUnit = parseFloat(seed['Lbs/Unit'].toString());
    const appRate = parseFloat(prod['Application Rate in Ounces'].toString());
    const costPerOz = parseFloat(prod['Product Cost per oz'].replace(/[^\d.-]/g, ''));
    const costPerPackage = parseFloat(prod['Product Cost per Package'].replace(/[^\d.-]/g, ''));
    const packageSize = parseFloat(prod['Package Size'].toString());

    const totalSeeds = rateType === 'seeds' ? acresNum * seedRate : acresNum * seedRate * seedsPerLb;
    const totalWeight = totalSeeds / seedsPerLb;
    const totalUnits = totalWeight / lbsPerUnit;
    const totalProductOz = totalUnits * appRate;
    const totalPackages = Math.ceil(totalProductOz / packageSize);

    const costPerUnit = costPerOz * appRate;
    const costPerAcre = (costPerUnit * totalUnits) / acresNum;
    const totalGrowerCost = totalPackages * costPerPackage;

    setResult({
      'Total Number of Seeds to be Treated': formatNumber(Math.round(totalSeeds)),
      'Total Weight of Seeds to be Treated': formatNumber(totalWeight),
      'Total Number of Units to be Treated': formatNumber(totalUnits),
      'Number of Seeds per Unit': formatNumber(seedsPerUnit),
      'Application Rate': `${formatNumber(appRate, 2)} oz per unit of seed`,
      'Total Amount of Product Needed': `${formatNumber(totalProductOz, 2)} oz`,
      'Total Number of Product Packages': `${formatNumber(totalPackages)} ${prod['Product Packaging'].toLowerCase()}`,
      'Product Cost per Package': `$${formatNumber(costPerPackage, 2)}`,
      'Total Cost to the Grower': `$${formatNumber(totalGrowerCost, 2)}`,
      'Product Cost per Ounce': `$${formatNumber(costPerOz, 2)}`,
      'Product Cost per Unit of Treated Seed': `$${formatNumber(costPerUnit, 2)}`,
      'Product Cost per Acre': `$${formatNumber(costPerAcre, 2)}`,
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
        <Button
          variant="ghost"
          className="text-sm text-zinc-400 hover:text-white border border-zinc-600 px-3 py-1 rounded"
          onClick={() => {
            const root = document.documentElement;
            root.classList.toggle('dark');
          }}
        >
          Toggle Theme
        </Button>
      </div>

      <Card className="bg-zinc-800 shadow-lg border border-zinc-700">
        <CardHeader>
          <CardTitle className="text-green-300">Calculator Form</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Seed Type</Label>
            <Select onValueChange={setSeedType}>
              <SelectTrigger><SelectValue placeholder="Select Seed Type" /></SelectTrigger>
              <SelectContent>
                {seedTypes.map((s, i) => (
                  <SelectItem key={i} value={s['Seed Type']}>{s['Seed Type']}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>How many acres to be planted?</Label>
            <Input value={acres} onChange={(e) => setAcres(e.target.value)} type="number" />
          </div>
          <div className="md:col-span-2">
            <Label>Product</Label>
            <Select onValueChange={setProduct}>
              <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
              <SelectContent>
                {products.map((p, i) => (
                  <SelectItem key={i} value={`${p['Product Name']} - ${p['Package Size']} ${p['Package Units']} - ${p['Product Packaging']}`}>
                    {`${p['Product Name']} - ${p['Package Size']} ${p['Package Units']} - ${p['Product Packaging']}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Seeding Rate</Label>
            <Input value={seedingRate} onChange={(e) => setSeedingRate(e.target.value)} type="number" />
          </div>
          <div>
            <Label>Rate Type</Label>
            <Select onValueChange={setRateType} defaultValue="seeds">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="seeds">Seeds/Acre</SelectItem>
                <SelectItem value="lbs">Lbs/Acre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Override Seeds per Pound (optional)</Label>
            {seedType && (
              <div className='text-sm text-zinc-400 mb-1'>Default Seeds/lb for {seedType}: {seedTypes.find(s => s['Seed Type'] === seedType)?.['Seeds/lb']}</div>
            )}
            <Input value={overrideSeeds} onChange={(e) => setOverrideSeeds(e.target.value)} type="number" />
          </div>
          <div className="md:col-span-2 text-center">
            <Button onClick={calculate} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full text-lg">Calculate</Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card ref={resultRef} className="mt-6 border border-green-400 bg-zinc-800 text-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-green-300">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result).map(([label, value], i) => (
              <div key={i} className="bg-zinc-900 rounded-xl p-3 border border-zinc-700">
                <strong className="text-green-400 block text-sm mb-1">{label}</strong>
                <span className="text-lg font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
          <div className="text-center my-4">
            <Button onClick={downloadPDF} className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-full text-white">Download PDF</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
