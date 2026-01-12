// src/types/assets.ts

export type AssetCategory =
  | "REAL_ESTATE"
  | "BANK_ACCOUNT"
  | "INVESTMENT"
  | "BUSINESS"
  | "VEHICLE"
  | "OTHER";

export type AssetStatus = "verified" | "stale" | "uncertain";

export interface Ownership {
  user: {
    name: string;
  };
}

export interface RealEstateAsset {
  propertyName: string;
  propertyType: string;
  location: string;
  plotNumber?: string;
  areaSqFt?: number;
  purchaseDate?: string;
  purchasePrice: number;
  currentValue: number;
  valuationDate?: string;
  rentalIncome?: number;
  updatedAt: string;
}

export interface BankAccountAsset {
  accountName: string;
  bankName: string;
  accountNumber?: string;
  accountType: string;
  currentBalance: number;
  interestRate?: number;
  openingDate?: string;
  updatedAt: string;
}

export interface InvestmentAsset {
  investmentName: string;
  broker: string;
  accountNumber?: string;
  investmentType: string;
  initialInvestment: number;
  investmentDate?: string;
  currentValue: number;
  lastUpdated?: string;
}

export interface BusinessAsset {
  businessName: string;
  licenseNumber?: string;
  industry: string;
  entityType?: string;
  initialInvestment: number;
  establishmentDate?: string;
  currentValuation: number;
  annualRevenue?: number;
  updatedAt: string;
}

export interface VehicleAsset {
  vehicleName: string;
  vehicleType: string;
  make?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  purchasePrice: number;
  purchaseDate?: string;
  currentValue: number;
  outstandingLoan?: number;
  updatedAt: string;
}

export interface OtherAsset {
  assetName: string;
  assetCategory: string;
  description?: string;
  purchasePrice: number;
  purchaseDate?: string;
  currentValuation: number;
  valuationDate?: string;
  updatedAt: string;
}

export interface RawAsset {
  id: string;
  category: AssetCategory;
  type: "asset" | "liability";
  status: AssetStatus;
  ownerships: Ownership[];
  realEstate?: RealEstateAsset;
  bankAccount?: BankAccountAsset;
  investment?: InvestmentAsset;
  business?: BusinessAsset;
  vehicle?: VehicleAsset;
  otherAsset?: OtherAsset;
}
