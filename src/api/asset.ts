import { mapAssetToRow } from "@/utils/assetmapper";

export interface AssetRow {
  id: string;
  category: string;
  subcategory?: string;
  owner: string;
  acquisition?: string;
  costBasis?: number;
  currentValue?: number;
  unrealizedGain?: number;
  allocation?: number;
  irr?: number;
  lastUpdated?: string;
  status: 'verified' | 'stale' | 'uncertain';
  type: 'asset' | 'liability';
}


export const getAssetById = async (id: string) => {
  const res = await fetch(`http://localhost:4000/api/assets/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch asset");
  }

  return data;
};

export const getAllAssets = async () => {
  const res = await fetch(`http://localhost:4000/api/assets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  console.log(data);

  if (!(res.ok)) {
    throw new Error( "Failed to fetch assets");
  }

  console.log('somwhat')
  const assetdata= data.map(mapAssetToRow);
 

  return assetdata
};
