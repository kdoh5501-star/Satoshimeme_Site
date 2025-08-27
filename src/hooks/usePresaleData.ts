import { useState, useEffect } from 'react';

interface PresaleData {
  tokenPrice: number;
  raisedAmount: number;
  targetAmount: number;
  tokensSold: number;
  totalTokens: number;
  walletAddresses: {
    tron: string;
    bsc: string;
    solana: string;
  };
  stage: number;
  startDate: string;
  endDate: string;
  minPurchase: number;
  lastUpdated: string;
}

// Default fallback data - Stage 2 Presale
const defaultData: PresaleData = {
  tokenPrice: 0.00008,
  raisedAmount: 534400,
  targetAmount: 800000,
  tokensSold: 6680000000,
  totalTokens: 10000000000,
  walletAddresses: {
    tron: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1',
    bsc: '0xe9e8e63fe2ebaa092bf6149e05431229c04765bf',
    solana: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD'
  },
  stage: 2,
  startDate: '2025-08-13T18:00:00+09:00',
  endDate: 'Until fundraising target is reached',
  minPurchase: 1000000,
  lastUpdated: new Date().toISOString()
};

export const usePresaleData = () => {
  const [data, setData] = useState<PresaleData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPresaleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from local API first, then fallback to external admin panel API
      let response = await fetch('/api/presale-data', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // If local API fails, try external admin panel API
      if (!response.ok) {
        response = await fetch('https://same-e4i4qkkel5u-latest.netlify.app/api/presale-data', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      }

      if (response.ok) {
        const adminData = await response.json();
        console.log('✅ Admin data loaded:', adminData);
        setData({
          ...defaultData,
          ...adminData,
          lastUpdated: new Date().toISOString()
        });
      } else {
        console.log('📊 Using fallback data - Admin API not available');
        // Use fallback data if API is not available
        setData(defaultData);
      }
    } catch (err) {
      console.log('📊 Using fallback data - Fetch error:', err);
      setError('Failed to fetch admin data, using fallback');
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPresaleData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchPresaleData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage
  const progressPercentage = Math.min((data.raisedAmount / data.targetAmount) * 100, 100);

  // Format token amounts
  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return {
    data,
    loading,
    error,
    progressPercentage: Number(progressPercentage.toFixed(2)),
    formatTokenAmount,
    formatCurrency,
    refresh: fetchPresaleData
  };
};
