import { useState } from 'react';
import { PortfolioAnalysis } from '@/lib/types';
import { formatCurrency, formatAddress, formatNumber } from '@/lib/utils';

export default function PortfolioPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PortfolioAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePortfolio = async () => {
    if (!walletAddress.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/portfolio?wallet=${encodeURIComponent(walletAddress.trim())}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to analyze portfolio');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzePortfolio();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Analysis</h1>
        
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                id="wallet"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x... (e.g., 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !walletAddress.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Portfolio'}
            </button>
          </form>
          
          {/* Quick Test Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Quick test with known wallets:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setWalletAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                disabled={loading}
              >
                Vitalik's Wallet
              </button>
              <button
                onClick={() => setWalletAddress('0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                disabled={loading}
              >
                Binance Hot Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-blue-800">Analyzing portfolio...</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.totalValueUSD)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Token Count</p>
                  <p className="text-2xl font-bold text-gray-900">{data.tokenCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Diversity Score</p>
                  <p className="text-2xl font-bold text-gray-900">{data.diversityScore}/100</p>
                  <p className="text-sm text-gray-600 capitalize">{data.portfolioHealth}</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Wallet</p>
                <p className="font-mono text-sm">{formatAddress(data.walletAddress, 10)}</p>
              </div>
            </div>

            {/* Top Holding */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Holding</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-green-900">{data.topHolding.symbol}</p>
                    <p className="text-sm text-green-700">{data.topHolding.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">
                      {formatCurrency(data.topHolding.valueUSD)}
                    </p>
                    <p className="text-sm text-green-700">{data.topHolding.percentage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights</h2>
              <div className="space-y-2">
                {data.aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Breakdown */}
            {Object.keys(data.sectorBreakdown).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sector Breakdown</h2>
                <div className="space-y-2">
                  {Object.entries(data.sectorBreakdown).map(([sector, info]) => (
                    <div key={sector} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{sector}</span>
                      <div className="text-right">
                        <span className="font-semibold">{formatCurrency(info.valueUSD)}</span>
                        <span className="text-sm text-gray-600 ml-2">({info.percentage})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Token Holdings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Token Holdings ({data.tokens.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value (USD)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Network
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.tokens.slice(0, 10).map((token, index) => (
                      <tr key={`${token.contract}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {token.symbol}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {token.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatNumber(parseFloat(token.amount) / Math.pow(10, token.decimals))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(token.value)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {token.network_id}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.tokens.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing top 10 of {data.tokens.length} tokens
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}