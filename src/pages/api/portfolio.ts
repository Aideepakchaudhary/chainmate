import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { APIResponse, PortfolioAnalysis, TokenBalance } from '@/lib/types';
import {
  calculateDiversityScore,
  getPortfolioHealth,
  generatePortfolioInsights,
  isValidAddress,
  formatCurrency
} from '@/lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<PortfolioAnalysis>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Method not allowed'
    });
  }

  const { wallet } = req.query;

  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Wallet address is required'
    });
  }

  if (!isValidAddress(wallet)) {
    return res.status(400).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      error: 'Invalid wallet address format'
    });
  }

  const startTime = Date.now();

  try {
    // Call The Graph Token API
    const response = await axios.get(
      `${process.env.TOKEN_API_BASE_URL}/balances/evm/${wallet}?limit=200`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GRAPH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const tokens: TokenBalance[] = response.data.data || [];

    if (!tokens || tokens.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          walletAddress: wallet,
          totalValueUSD: 0,
          tokenCount: 0,
          topHolding: {
            symbol: 'N/A',
            name: 'No tokens found',
            valueUSD: 0,
            percentage: '0%'
          },
          diversityScore: 0,
          portfolioHealth: 'concentrated',
          sectorBreakdown: {},
          lastActivity: 'Unknown',
          tokens: [],
          aiInsights: ['This wallet has no token holdings or is not on supported networks']
        },
        timestamp: new Date().toISOString(),
        requestDuration: Date.now() - startTime
      });
    }

    // Calculate portfolio metrics
    const totalValueUSD = tokens.reduce((sum, token) => sum + token.value, 0);
    const tokenCount = tokens.length;
    
    // Find top holding
    const sortedTokens = tokens.sort((a, b) => b.value - a.value);
    const topToken = sortedTokens[0];
    const topPercentage = ((topToken.value / totalValueUSD) * 100).toFixed(1);
    
    // Calculate diversity score
    const diversityScore = calculateDiversityScore(tokens);
    const portfolioHealth = getPortfolioHealth(diversityScore);

    // Simple sector categorization (can be enhanced later)
    const sectorBreakdown: Record<string, { valueUSD: number; percentage: string }> = {};
    
    tokens.forEach(token => {
      let sector = 'Other';
      
      // Basic categorization by token symbol/name
      const symbol = token.symbol.toLowerCase();
      const name = token.name.toLowerCase();
      
      if (symbol.includes('ai') || name.includes('artificial') || name.includes('machine')) {
        sector = 'AI/ML';
      } else if (symbol === 'eth' || symbol === 'btc' || symbol === 'sol') {
        sector = 'Layer 1';
      } else if (name.includes('defi') || ['uni', 'aave', 'comp', 'link'].includes(symbol)) {
        sector = 'DeFi';
      } else if (name.includes('meme') || ['doge', 'shib', 'pepe'].includes(symbol)) {
        sector = 'Memes';
      }
      
      if (!sectorBreakdown[sector]) {
        sectorBreakdown[sector] = { valueUSD: 0, percentage: '0%' };
      }
      
      sectorBreakdown[sector].valueUSD += token.value;
    });

    // Calculate sector percentages
    Object.keys(sectorBreakdown).forEach(sector => {
      const percentage = ((sectorBreakdown[sector].valueUSD / totalValueUSD) * 100).toFixed(1);
      sectorBreakdown[sector].percentage = `${percentage}%`;
    });

    // Get last activity (use the most recent balance update)
    const lastActivity = tokens.reduce((latest, token) => {
      const tokenDate = new Date(token.last_balance_update);
      const latestDate = new Date(latest);
      return tokenDate > latestDate ? token.last_balance_update : latest;
    }, tokens[0]?.last_balance_update || new Date().toISOString());

    // Generate AI insights
    const aiInsights = generatePortfolioInsights({
      diversityScore,
      tokenCount,
      topHolding: { percentage: `${topPercentage}%` }
    });

    // Add portfolio value insights
    if (totalValueUSD > 1000000) {
      aiInsights.unshift('High-value portfolio detected - consider advanced risk management strategies');
    } else if (totalValueUSD < 1000) {
      aiInsights.push('Small portfolio size - focus on building core positions first');
    }

    const portfolioAnalysis: PortfolioAnalysis = {
      walletAddress: wallet,
      totalValueUSD,
      tokenCount,
      topHolding: {
        symbol: topToken.symbol,
        name: topToken.name,
        valueUSD: topToken.value,
        percentage: `${topPercentage}%`
      },
      diversityScore,
      portfolioHealth,
      sectorBreakdown,
      lastActivity,
      tokens: sortedTokens,
      aiInsights
    };

    res.status(200).json({
      success: true,
      data: portfolioAnalysis,
      timestamp: new Date().toISOString(),
      requestDuration: Date.now() - startTime
    });

  } catch (error: any) {
    console.error('Portfolio API Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      requestDuration: Date.now() - startTime,
      error: error.response?.data?.message || 'Failed to fetch portfolio data'
    });
  }
}