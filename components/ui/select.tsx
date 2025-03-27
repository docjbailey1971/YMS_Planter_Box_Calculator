import * as React from "react";
import { cn } from "../../lib/utils";

export const Select = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border border-gray-300 rounded p-2">{children}</div>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow border mt-1">{children}</div>
);

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <div className="p-2 hover:bg-gray-100 cursor-pointer" data-value={value}>{children}</div>
);

export const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-gray-600">{placeholder}</span>
);
