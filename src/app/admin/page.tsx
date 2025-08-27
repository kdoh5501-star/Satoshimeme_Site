"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePresaleData } from "@/hooks/usePresaleData";

interface PresaleFormData {
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
}

interface Transaction {
  id: string;
  walletAddress: string;
  amount: number;
  tokenAmount: number;
  network: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'presale' | 'transactions'>('dashboard');

  const {
    data: presaleData,
    loading: presaleLoading,
    formatTokenAmount,
    formatCurrency,
    refresh: refreshPresaleData
  } = usePresaleData();

  const [formData, setFormData] = useState<PresaleFormData>({
    tokenPrice: 0.0000725,
    raisedAmount: 327224,
    targetAmount: 580000,
    tokensSold: 4512711379,
    totalTokens: 8000000000,
    walletAddresses: {
      tron: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1',
      bsc: '0xe9e8e63fe2ebaa092bf6149e05431229c04765bf',
      solana: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD'
    },
    stage: 1,
    startDate: '2025-08-01T18:00:00+09:00',
    endDate: '2025-08-05T18:00:00+09:00',
    minPurchase: 1000000,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 편집 상태 추적

  // Check for saved authentication on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load presale data into form when component mounts (only when not editing)
  useEffect(() => {
    if (presaleData && !isEditing) {
      setFormData({
        tokenPrice: presaleData.tokenPrice,
        raisedAmount: presaleData.raisedAmount,
        targetAmount: presaleData.targetAmount,
        tokensSold: presaleData.tokensSold,
        totalTokens: presaleData.totalTokens,
        walletAddresses: presaleData.walletAddresses,
        stage: presaleData.stage,
        startDate: presaleData.startDate,
        endDate: presaleData.endDate,
        minPurchase: presaleData.minPurchase,
      });
    }
  }, [presaleData, isEditing]);

  // Load transactions from API
  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'satoshi2025!') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleInputChange = (field: string, value: string | number) => {
    // 편집 상태로 설정
    setIsEditing(true);

    if (field.startsWith('walletAddresses.')) {
      const walletField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        walletAddresses: {
          ...prev.walletAddresses,
          [walletField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSavePresaleData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/presale-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Presale data saved successfully!');
        setIsEditing(false); // 저장 완료 후 편집 상태 해제
        await refreshPresaleData();
      } else {
        const error = await response.json();
        alert(`Error saving presale data: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving presale data:', error);
      alert('Error saving presale data');
    } finally {
      setIsSaving(false);
    }
  };

  // 편집 취소 함수
  const handleCancelEdit = () => {
    if (presaleData) {
      setFormData({
        tokenPrice: presaleData.tokenPrice,
        raisedAmount: presaleData.raisedAmount,
        targetAmount: presaleData.targetAmount,
        tokensSold: presaleData.tokensSold,
        totalTokens: presaleData.totalTokens,
        walletAddresses: presaleData.walletAddresses,
        stage: presaleData.stage,
        startDate: presaleData.startDate,
        endDate: presaleData.endDate,
        minPurchase: presaleData.minPurchase,
      });
    }
    setIsEditing(false);
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const result = await response.json();
        setTransactions(result.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('Transaction status updated successfully!');
        await loadTransactions();
      } else {
        const error = await response.json();
        alert(`Error updating transaction: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction');
    }
  };

  const progressPercentage = Math.min((formData.raisedAmount / formData.targetAmount) * 100, 100);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-slate-900 border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter admin password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">SATOSHI MEME Admin Panel</h1>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 px-6 py-3">
        <div className="flex space-x-4">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'presale', label: 'Presale Settings' },
            { id: 'transactions', label: 'Transactions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dashboard' | 'presale' | 'transactions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-slate-900 border-slate-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Raised</h3>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(formData.raisedAmount)}</p>
              <p className="text-sm text-gray-400">Target: {formatCurrency(formData.targetAmount)}</p>
            </Card>

            <Card className="p-6 bg-slate-900 border-slate-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Tokens Sold</h3>
              <p className="text-3xl font-bold text-blue-400">{formatTokenAmount(formData.tokensSold)}</p>
              <p className="text-sm text-gray-400">Total: {formatTokenAmount(formData.totalTokens)}</p>
            </Card>

            <Card className="p-6 bg-slate-900 border-slate-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Progress</h3>
              <p className="text-3xl font-bold text-yellow-400">{progressPercentage.toFixed(2)}%</p>
              <div className="mt-2 w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 border-slate-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Current Stage</h3>
              <p className="text-3xl font-bold text-purple-400">Stage {formData.stage}</p>
              <p className="text-sm text-gray-400">Price: ${formData.tokenPrice}</p>
            </Card>
          </div>
        )}

        {activeTab === 'presale' && (
          <Card className="p-6 bg-slate-900 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Presale Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Price (USDT)
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  value={formData.tokenPrice}
                  onChange={(e) => handleInputChange('tokenPrice', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Raised Amount (USDT)
                </label>
                <input
                  type="number"
                  value={formData.raisedAmount}
                  onChange={(e) => handleInputChange('raisedAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Amount (USDT)
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tokens Sold
                </label>
                <input
                  type="number"
                  value={formData.tokensSold}
                  onChange={(e) => handleInputChange('tokensSold', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Tokens
                </label>
                <input
                  type="number"
                  value={formData.totalTokens}
                  onChange={(e) => handleInputChange('totalTokens', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stage
                </label>
                <input
                  type="number"
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate.slice(0, -6)}
                  onChange={(e) => handleInputChange('startDate', e.target.value + '+09:00')}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate.slice(0, -6)}
                  onChange={(e) => handleInputChange('endDate', e.target.value + '+09:00')}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wallet Addresses</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    TRON Address
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddresses.tron}
                    onChange={(e) => handleInputChange('walletAddresses.tron', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    BSC Address
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddresses.bsc}
                    onChange={(e) => handleInputChange('walletAddresses.bsc', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Solana Address
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddresses.solana}
                    onChange={(e) => handleInputChange('walletAddresses.solana', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {isEditing && (
                <div className="bg-blue-900/50 border border-blue-400 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 font-medium">편집 중... (자동 새로고침이 일시 중단됨)</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={handleSavePresaleData}
                  disabled={isSaving}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>

                {isEditing && (
                  <Button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card className="p-6 bg-slate-900 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>

            <div className="mb-4 flex gap-4">
              <Button
                onClick={() => loadTransactions()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Refresh Transactions
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300">Wallet Address</th>
                    <th className="text-left py-3 px-4 text-gray-300">Amount (USDT)</th>
                    <th className="text-left py-3 px-4 text-gray-300">Tokens</th>
                    <th className="text-left py-3 px-4 text-gray-300">Network</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-700">
                      <td className="py-3 px-4 text-white font-mono text-xs">{tx.walletAddress}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">${tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-blue-400">{formatTokenAmount(tx.tokenAmount)}</td>
                      <td className="py-3 px-4 text-yellow-400">{tx.network}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                          tx.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {tx.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateTransactionStatus(tx.id, 'confirmed')}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateTransactionStatus(tx.id, 'failed')}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {tx.status === 'failed' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'pending')}
                              className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
