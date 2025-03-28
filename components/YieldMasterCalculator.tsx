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

function formatNumber(n, decimals = 0) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export default function YieldMasterCalculator() {
  const [seedType, setSeedType] = useState('');
  const [acres, setAcres] = useState('');
  const [product, setProduct] = useState('');
  const [seedingRate, setSeedingRate] = useState('');
  const [rateType, setRateType] = useState('seeds');
  const [overrideSeeds, setOverrideSeeds] = useState('');
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const downloadPDF = () => {
    try {
      if (resultRef.current) {
        setTimeout(() => {
          html2canvas(resultRef.current, { scale: 2 }).then(canvas => {
        setTimeout(() => {
          html2canvas(resultRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 40;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save('YieldMaster_Calculation.pdf');
          });
        }, 250);
          const pdf = new jsPDF('p', 'pt', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = pageWidth - 40; // 20pt margin
          const imgHeight = canvas.height * imgWidth / canvas.width;
          pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
          pdf.save('YieldMaster_Calculation.pdf');
          });
        }, 250);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. See console for details.');
    }
  };

  const calculate = () => {
    const seed = seedTypes.find(s => s['Seed Type'] === seedType);
    const prod = products.find(p => `${p['Product Name']} - ${p['Package Size']} ${p['Package Units']} - ${p['Product Packaging']}` === product);
    if (!seed || !prod || !acres || !seedingRate) return;

    const seedsPerLb = overrideSeeds ? parseFloat(overrideSeeds) : parseFloat(seed['Seeds/lb'].replace(/,/g, ''));
    const acresNum = parseFloat(acres);
    const seedRate = parseFloat(seedingRate);
    const seedsPerUnit = parseFloat(seed['Seeds/Unit'].replace(/,/g, ''));
    const lbsPerUnit = parseFloat(seed['Lbs/Unit']);

    const appRate = parseFloat(prod['Application Rate in Ounces']);
    const costPerOz = parseFloat(prod['Product Cost per oz'].replace(/[^\d.-]/g, ''));
    const costPerPackage = parseFloat(prod['Product Cost per Package'].replace(/[^\d.-]/g, ''));
    const packageSize = parseFloat(prod['Package Size']);

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

  // JSX remains the same
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-zinc-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-300">YieldMaster Solutions Planter Box Calculator</h1>
      <p className="text-center text-sm text-muted">Please enter your planting and product information below.</p>

      <Card>
        <CardHeader><CardTitle>Calculator Form</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
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
          <div className="col-span-2">
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
          <div className="col-span-2">
            <Label>Override Seeds per Pound (optional)</Label>
            {seedType && (
              <div className='text-sm text-muted-foreground mb-1'>Default Seeds/lb for {seedType}: {seedTypes.find(s => s['Seed Type'] === seedType)?.['Seeds/lb']}</div>
            )}
            <Input value={overrideSeeds} onChange={(e) => setOverrideSeeds(e.target.value)} type="number" />
          </div>
          <div className="col-span-2 text-center">
            <Button onClick={calculate}>Calculate</Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card ref={resultRef} className="mt-6 border-2 border-green-400 bg-zinc-800 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-semibold text-green-300">Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(result).map(([label, value], i) => (
                <div key={i}><strong>{label}: </strong>{value}</div>
              ))}
            </CardContent>
            
          </Card>
      )}
    </div>
  );
}
