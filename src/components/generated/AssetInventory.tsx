import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Search, Filter, FileText, CheckCircle2, AlertCircle, DollarSign, Percent, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddAssetModal } from './AddAssetModal';
import { getAllAssets } from '@/api/asset';

// --- Types ---

interface AssetRow {
  id: string;
  category: string;
  subcategory: string;
  owner: string;
  acquisition: string;
  costBasis: number;
  currentValue: number;
  unrealizedGain: number;
  allocation: number;
  irr: number;
  lastUpdated: string;
  status: 'verified' | 'stale' | 'uncertain';
  type: 'asset' | 'liability';
}

// --- Mock Master Data ---

// --- Sub-components ---

const StatusBadge = ({
  status
}: {
  status: AssetRow['status'];
}) => {
  const styles = {
    verified: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
    stale: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
    uncertain: 'bg-[#1E5F46]/5 text-[#1E5F46]/70 border-[#1E5F46]/10'
  };
  const icons = {
    verified: <CheckCircle2 className="w-3 h-3 mr-1" />,
    stale: <AlertCircle className="w-3 h-3 mr-1" />,
    uncertain: <AlertCircle className="w-3 h-3 mr-1" />
  };
  return <span className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.toUpperCase()}
    </span>;
};

// --- Main Component ---

export const AssetInventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allAssets, setAllAssets] = useState<AssetRow[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assets = await getAllAssets();
        setAllAssets(assets);
        setLoading(false);
      } catch (err) {
        console.log('Assent fetch failed');
        // setError('Failed to fetch assets');
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);
  
  const assets = allAssets.filter(a => a.type === 'asset');
  const liabilities = allAssets.filter(a => a.type === 'liability');
  const owners = ['All', ...Array.from(new Set(allAssets.map(a => a.owner)))];

  // Filter assets based on search and owner
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.category.toLowerCase().includes(searchQuery.toLowerCase()) || (asset.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = selectedOwner === 'All' || asset.owner === selectedOwner;
    return matchesSearch && matchesOwner;
  });

  const filteredLiabilities = liabilities.filter(liability => {
    const matchesSearch = liability.category.toLowerCase().includes(searchQuery.toLowerCase()) || (liability.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || liability.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = selectedOwner === 'All' || liability.owner === selectedOwner;
    return matchesSearch && matchesOwner;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(Math.abs(val));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return <div className="p-4 text-center">Loading assets...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  return <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#1E5F46]/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E5F46]">Asset Inventory</h1>
              <p className="text-sm text-[#1E5F46]/60 mt-1">Complete balance sheet view of family holdings</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
                <FileText className="w-4 h-4" />
                Export Data
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-md text-sm font-medium hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                New Asset
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-white border border-[#1E5F46]/10 rounded-lg p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-[#1E5F46]/60 uppercase tracking-wide mb-1">Total Assets</p>
            {/* <h3 className="text-2xl font-bold text-[#1E5F46]">{formatCurrency(allAssets)}</h3> */}
            <p className="text-xs text-[#1E5F46]/50 mt-1">{assets.length} asset entries</p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="bg-white border border-[#1E5F46]/10 rounded-lg p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-[#1E5F46]/60 uppercase tracking-wide mb-1">Total Liabilities</p>
            {/* <h3 className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totalLiabilities)}</h3> */}
            <p className="text-xs text-[#1E5F46]/50 mt-1">{liabilities.length} liability entries</p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="bg-white border border-[#1E5F46]/10 rounded-lg p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#1E5F46] to-[#166534] text-white">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-[#1E5F46]/60 uppercase tracking-wide mb-1">Net Equity</p>
            {/* <h3 className="text-2xl font-bold text-[#1E5F46]">{formatCurrency(totalEquity)}</h3> */}
            <p className="text-xs text-[#1E5F46]/50 mt-1">Assets - Liabilities</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1E5F46]/40" />
              <input type="text" placeholder="Search entries..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent w-80 bg-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1E5F46]/70">Owner:</span>
              <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)} className="px-3 py-2 border border-[#1E5F46]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent bg-white text-[#1E5F46]">
                {owners.map(owner => <option key={owner} value={owner}>
                    {owner}
                  </option>)}
              </select>
            </div>
          </div>
          <p className="text-sm text-[#1E5F46]/60">
            {/* Showing {filteredAssets.length + filteredLiabilities.length} of {MASTER_ASSET_DATA.length} entries */}
          </p>
        </div>

        {/* Balance Sheet Table */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white border border-[#1E5F46]/10 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F3EF] border-b border-[#1E5F46]/10">
                <tr className="text-xs font-semibold text-[#1E5F46]/70 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Subcategory</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Acquisition</th>
                  <th className="px-6 py-3 text-right">Cost Basis</th>
                  <th className="px-6 py-3 text-right">Current Value</th>
                  <th className="px-6 py-3 text-right">Change</th>
                  <th className="px-6 py-3 text-right">IRR</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E5F46]/5">
                {/* ASSETS SECTION */}
                <tr className="bg-[#10B981]/5">
                  <td colSpan={9} className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#10B981] rounded-full" />
                      <span className="text-sm font-bold text-[#1E5F46] uppercase tracking-wide">Assets</span>
                    </div>
                  </td>
                </tr>
                {filteredAssets.map(asset => <tr key={asset.id} className="hover:bg-[#F5F3EF] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${asset.category === 'Real Estate' ? 'bg-[#8B5CF6]' : asset.category === 'Financial Assets' ? 'bg-[#3B82F6]' : asset.category === 'Operating Businesses' ? 'bg-[#EC4899]' : asset.category === 'Alternatives' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`} />
                        <span className="text-sm font-semibold text-[#1E5F46]">{asset.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70">{asset.subcategory}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${asset.owner === 'Zanulda' ? 'bg-[#EC4899]/10 text-[#EC4899]' : asset.owner === 'Aamir' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : asset.owner === 'Taher' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#1E5F46]/10 text-[#1E5F46]'}`}>
                        {asset.owner}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#1E5F46]/40" />
                        {formatDate(asset.acquisition)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70 text-right font-medium">
                      {formatCurrency(asset.costBasis)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46] text-right font-bold">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {asset.unrealizedGain > 0 ? <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#10B981]">
                          <ArrowUpRight className="w-3 h-3" />
                          {formatCurrency(asset.unrealizedGain)}
                        </div> : asset.unrealizedGain < 0 ? <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#EF4444]">
                          <ArrowDownRight className="w-3 h-3" />
                          {formatCurrency(Math.abs(asset.unrealizedGain))}
                        </div> : <span className="text-sm text-[#1E5F46]/40">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-semibold ${asset.irr > 15 ? 'text-[#10B981]' : asset.irr > 8 ? 'text-[#3B82F6]' : 'text-[#1E5F46]/60'}`}>
                        {asset.irr.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={asset.status} />
                    </td>
                  </tr>)}
                
                {/* ASSETS SUBTOTAL */}
                <tr className="bg-[#10B981]/10 border-t-2 border-[#10B981]/30">
                  <td colSpan={5} className="px-6 py-3 text-sm font-bold text-[#1E5F46]">
                    Total Assets
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-[#1E5F46] text-right">
                    {formatCurrency(filteredAssets.reduce((sum, a) => sum + a.currentValue, 0))}
                  </td>
                  <td colSpan={3}></td>
                </tr>

                {/* LIABILITIES SECTION */}
                <tr className="bg-[#EF4444]/5">
                  <td colSpan={9} className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#EF4444] rounded-full" />
                      <span className="text-sm font-bold text-[#1E5F46] uppercase tracking-wide">Liabilities</span>
                    </div>
                  </td>
                </tr>
                {filteredLiabilities.map(liability => <tr key={liability.id} className="hover:bg-[#F5F3EF] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        <span className="text-sm font-semibold text-[#1E5F46]">{liability.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70">{liability.subcategory}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${liability.owner === 'Zanulda' ? 'bg-[#EC4899]/10 text-[#EC4899]' : liability.owner === 'Aamir' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : liability.owner === 'Taher' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#1E5F46]/10 text-[#1E5F46]'}`}>
                        {liability.owner}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#1E5F46]/40" />
                        {formatDate(liability.acquisition)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E5F46]/70 text-right font-medium">
                      ({formatCurrency(liability.costBasis)})
                    </td>
                    <td className="px-6 py-4 text-sm text-[#EF4444] text-right font-bold">
                      ({formatCurrency(liability.currentValue)})
                    </td>
                    <td className="px-6 py-4 text-right">
                      {liability.unrealizedGain > 0 ? <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#10B981]">
                          <ArrowUpRight className="w-3 h-3" />
                          {formatCurrency(liability.unrealizedGain)}
                        </div> : <span className="text-sm text-[#1E5F46]/40">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-[#EF4444]">
                        {liability.irr.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={liability.status} />
                    </td>
                  </tr>)}

                {/* LIABILITIES SUBTOTAL */}
                <tr className="bg-[#EF4444]/10 border-t-2 border-[#EF4444]/30">
                  <td colSpan={5} className="px-6 py-3 text-sm font-bold text-[#1E5F46]">
                    Total Liabilities
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-[#EF4444] text-right">
                    ({formatCurrency(Math.abs(filteredLiabilities.reduce((sum, l) => sum + l.currentValue, 0)))})
                  </td>
                  <td colSpan={3}></td>
                </tr>

                {/* NET EQUITY */}
                <tr className="bg-[#1E5F46]/10 border-t-4 border-[#1E5F46]">
                  <td colSpan={5} className="px-6 py-4 text-base font-bold text-[#1E5F46] uppercase">
                    Net Equity
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-[#1E5F46] text-right">
                    {formatCurrency(filteredAssets.reduce((sum, a) => sum + a.currentValue, 0) + filteredLiabilities.reduce((sum, l) => sum + l.currentValue, 0))}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Info Card */}
        <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1E5F46] mb-1">Balance Sheet View</h3>
              <p className="text-sm text-[#1E5F46]/70">
                This table presents a complete balance sheet structure showing all family assets, liabilities, and the resulting net equity position. 
                Assets are grouped by category, followed by all liabilities, with the final equity calculation at the bottom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={data => {
      console.log('New asset data:', data);
      // Handle asset creation here
    }} />
    </div>;
};