'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';

interface Asset {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  priceNGN?: number;
  priceUSD?: number;
  matrixId?: string;
  resourceType: string;
  secureAssetUrl?: string;
}

interface StoreAssetsSectionProps {
  assets: Asset[];
}

export default function StoreAssetsSection({ assets }: StoreAssetsSectionProps) {
  const { currentCurrency, convertPrice } = useCurrency();
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

  const formatAmount = (amount: number) => {
    const isWholeNumberCurrency = ['NGN', 'KES', 'ZAR'].includes(currentCurrency.code);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: isWholeNumberCurrency ? 0 : 2,
      maximumFractionDigits: isWholeNumberCurrency ? 0 : 2,
    }).format(amount);
  };

  const getAssetPrice = () => {
    // Strictly use USD 9.99 as requested by user
    const baseUSD = 9.99;
    return convertPrice(baseUSD, currentCurrency.code);
  };

  return (
    <section className="mb-24">
      <h2 className="text-3xl font-bold font-serif text-slate-950 dark:text-white mb-10 flex items-center gap-4">
        Companion Digital Assets
        <span className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const price = getAssetPrice();
          const formattedPrice = formatAmount(price);

          return (
            <div key={asset._id} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-[10px] font-black bg-slate-950 text-white px-2 py-1 rounded">{asset.matrixId}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{asset.resourceType}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{asset.title}</h3>
                <p className="text-xl font-mono font-black text-slate-900 dark:text-white mb-6">{formattedPrice}</p>
              </div>
              <button 
                onClick={() => setActiveAsset(asset)}
                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white transition-all"
              >
                Get Resource
              </button>
            </div>
          );
        })}
      </div>

      {activeAsset && (
        <TwoStepCheckoutModal
          isOpen={!!activeAsset}
          onClose={() => setActiveAsset(null)}
          title={activeAsset.title}
          price={getAssetPrice()}
          currency={currentCurrency.code}
          itemId={activeAsset._id}
          itemType="asset"
          onSuccess={() => setActiveAsset(null)}
        />
      )}
    </section>
  );
}
