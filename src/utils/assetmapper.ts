import { BankAccountAsset, BusinessAsset, InvestmentAsset, OtherAsset, RealEstateAsset, VehicleAsset } from "@/types/assets";
import { AssetRow } from "../api/asset";

interface RawAsset {
  id: string;
  category: string;
  type: "asset" | "liability";
  status: "verified" | "stale" | "uncertain";
  owners: { user: { name: string } }[];
  // specific fields
  vehicle?: VehicleAsset;
  realEstate?: RealEstateAsset;
  bankAccount?: BankAccountAsset;
  investment?: InvestmentAsset;
  business?: BusinessAsset;
  otherAsset?: OtherAsset;
}

export const mapAssetToRow = (asset: RawAsset): AssetRow => {
  const owner = "Unknown";

  switch (asset.category) {
    case "VEHICLE":
        if (!asset.vehicle)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Vehicle",
        subcategory: asset.vehicle?.model || "—",
        owner,
        acquisition: asset.vehicle?.purchaseDate,
        costBasis: asset.vehicle?.purchasePrice,
        currentValue: asset.vehicle?.currentValue,
        unrealizedGain: asset.vehicle?.currentValue - asset.vehicle?.purchasePrice,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.vehicle?.updatedAt,
        status: 'verified',
        type: 'asset',
      };

    case "REAL_ESTATE":
                if (!asset.realEstate)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Real Estate",
        subcategory: asset.realEstate?.propertyName || "—",
        owner,
        acquisition: asset.realEstate?.purchaseDate,
        costBasis: asset.realEstate?.purchasePrice,
        currentValue: asset.realEstate?.currentValue,
        unrealizedGain: asset.realEstate?.currentValue - asset.realEstate?.purchasePrice,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.realEstate?.updatedAt,
        status: 'verified',
        type: 'asset',
      };

    case "BANK_ACCOUNT":
                if (!asset.bankAccount)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Bank Account",
        subcategory: asset.bankAccount?.accountName || "—",
        owner,
        acquisition: asset.bankAccount?.openingDate,
        costBasis: 0,
        currentValue: asset.bankAccount?.currentBalance,
        unrealizedGain: asset.bankAccount?.currentBalance,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.bankAccount?.updatedAt,
        status: 'verified',
        type: 'asset',
      };

    case "INVESTMENT":
                if (!asset.investment)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Investment",
        subcategory: asset.investment?.investmentName || "—",
        owner,
        acquisition: asset.investment?.investmentDate,
        costBasis: asset.investment?.initialInvestment,
        currentValue: asset.investment?.currentValue,
        unrealizedGain: asset.investment?.currentValue - asset.investment?.initialInvestment,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.investment?.lastUpdated,
        status: 'verified',
        type: 'asset',
      };

    case "BUSINESS":
                if (!asset.business)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Business",
        subcategory: asset.business?.businessName || "—",
        owner,
        acquisition: asset.business?.establishmentDate,
        costBasis: asset.business?.initialInvestment,
        currentValue: asset.business?.currentValuation,
        unrealizedGain: asset.business?.currentValuation - asset.business?.initialInvestment,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.business?.updatedAt,
        status: 'verified',
        type: 'asset',
      };

    case "OTHER":
                if (!asset.otherAsset)
        {
            throw Error('Invalid Asset');
        }
      return {
        id: asset.id,
        category: "Other",
        subcategory: asset.otherAsset?.assetName || "—",
        owner,
        acquisition: asset.otherAsset?.purchaseDate,
        costBasis: asset.otherAsset?.purchasePrice,
        currentValue: asset.otherAsset?.currentValuation,
        unrealizedGain: asset.otherAsset?.currentValuation - asset.otherAsset?.purchasePrice,
        allocation: 0,
        irr: 0,
        lastUpdated: asset.otherAsset?.updatedAt,
        status: 'verified',
        type: 'asset',
      };

    default:
      return {
        id: asset.id,
        category: "Unknown",
        subcategory: "—",
        owner,
        status: 'verified',
        type: 'asset',
      };
  }
};
