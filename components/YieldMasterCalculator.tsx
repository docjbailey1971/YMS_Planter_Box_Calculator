'use client';
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

function formatNumber(n: number, decimals = 0) {
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
  const [result, setResult] = useState<number | null>(null);
  const resultRef = useRef(null);

  const calculate = () => {
    const area = parseFloat(acres);
    const rate = parseFloat(seedingRate);
    const override = parseFloat(overrideSeeds);
    if (!area || (!rate && !override)) return setResult(null);

    const seedsPerAcre = override > 0 ? override : rate;
    const totalSeeds = seedsPerAcre * area;

    const poundsPerSeed = 0.00035; // adjust based on actual seed specs
    const totalPounds = totalSeeds * poundsPerSeed;

    setResult(totalPounds);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-zinc-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-300">YieldMaster Solutions Planter Box Calculator</h1>

      <Card>
        <CardHeader>
          <CardTitle>Input Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Seed Type</Label>
              <Select onValueChange={setSeedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select seed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Product</Label>
              <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Talc + Graphite" />
            </div>

            <div>
              <Label>Seeding Rate (seeds/acre)</Label>
              <Input value={seedingRate} onChange={e => setSeedingRate(e.target.value)} />
            </div>

            <div>
              <Label>Acres</Label>
              <Input value={acres} onChange={e => setAcres(e.target.value)} />
            </div>

            <div>
              <Label>Override Seeds/Acre (optional)</Label>
              <Input value={overrideSeeds} onChange={e => setOverrideSeeds(e.target.value)} />
            </div>
          </div>

          <Button className="mt-4" onClick={calculate}>
            Calculate
          </Button>

          {result !== null && (
            <div ref={resultRef} className="pt-4 text-lg">
              Estimated total product needed: <strong>{formatNumber(result, 2)} lbs</strong>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
