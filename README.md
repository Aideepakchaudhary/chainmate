# 🤖 ChainMate - AI Crypto Analyst

**AI-powered crypto portfolio analysis powered by The Graph Token API**

Built for ETHGlobal New Delhi 2025 🇮🇳

## ✨ Features

- 🔍 **Natural Language Portfolio Analysis** - "Analyze this wallet: 0x..."
- 📊 **Real-time Blockchain Data** - Powered by The Graph Token API
- 🤖 **AI-Powered Insights** - Diversity scoring, risk assessment, recommendations
- ⚡ **Instant Results** - Sub-2 second response times
- 🎯 **Multi-chain Support** - Ethereum and EVM-compatible chains

## 🚀 Live Demo

1. **Homepage Chat**: http://localhost:3000 - AI chat interface
2. **Direct Portfolio**: http://localhost:3000/portfolio - Direct portfolio analysis

### Quick Test Queries:
```
Analyze this wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Show me Vitalik's portfolio  
What tokens does 0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE own?
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- The Graph API Key
- OpenAI API Key

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Environment setup** (already configured):
```bash
# .env.local
GRAPH_API_KEY=your_graph_api_key_here
TOKEN_API_BASE_URL=https://token-api.thegraph.com
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Start development server**:
```bash
npm run dev
```

## 🏗️ Architecture

### Backend APIs
- **`/api/portfolio`** - Portfolio analysis with The Graph Token API
- **`/api/chat`** - LangChain AI agent with portfolio tools

### Frontend Pages
- **`/`** - Homepage with AI chat interface
- **`/portfolio`** - Direct portfolio analysis form

### AI Tools
- **Portfolio Analysis Tool** - Analyzes wallet holdings and generates insights
- **Address Extraction** - Automatically detects wallet addresses in queries
- **Intent Detection** - Routes queries to appropriate analysis tools

## 📊 Portfolio Metrics

### Core Analytics
- **Total Value (USD)** - Sum of all token holdings
- **Token Count** - Number of unique tokens
- **Diversity Score** - Shannon entropy-based portfolio diversity (0-100)
- **Portfolio Health** - Concentrated/Moderate/Diversified classification
- **Top Holdings** - Largest positions by value
- **Sector Breakdown** - AI/ML, DeFi, Layer 1, Memes categorization

### AI Insights
- Risk concentration warnings
- Diversification recommendations
- Portfolio size assessments
- Activity-based insights

## 🔧 Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **AI**: LangChain, OpenAI GPT-3.5-turbo
- **Data**: The Graph Token API
- **Backend**: Next.js API Routes
- **Utils**: Axios, Zod validation

## 🎯 ETHGlobal Demo Flow

### 30-Second Demo:
1. **Open homepage**: Show AI chat interface
2. **Ask**: "Analyze Vitalik's wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
3. **Show results**: Live portfolio data with AI insights
4. **Highlight**: Real-time blockchain data + natural language processing

### Key Highlights:
- ✅ **Working with real data** from The Graph Token API
- ✅ **Natural language interface** - no technical knowledge needed
- ✅ **Instant insights** - portfolio health, diversification, recommendations
- ✅ **Production-ready** - error handling, loading states, responsive UI

## 📈 Sample Results

**Vitalik's Wallet Analysis:**
- Total Value: $7.2T+ (test data with unusual tokens)
- Tokens: 200 unique holdings
- Diversity Score: 4/100 (highly concentrated)
- Top Holding: 96.6% in one token
- AI Insight: "High concentration risk - consider diversification"

## 🔮 Future Features

- 🐋 **Whale Tracking** - Monitor large token holders
- 🔄 **Multi-chain Comparison** - Compare same token across chains
- 📊 **Historical Analysis** - Portfolio performance over time  
- 🚨 **Real-time Alerts** - Whale movement notifications
- 📱 **Mobile App** - React Native implementation

## 🏆 Competition Advantages

1. **Real Blockchain Data** - Not mocked data, actual The Graph API
2. **AI-First UX** - Natural language beats complex UIs
3. **Instant Insights** - Automated analysis saves hours of manual research
4. **Extensible Architecture** - Easy to add new analysis tools
5. **Production Quality** - Error handling, TypeScript, responsive design

---

**Built with ❤️ for ETHGlobal New Delhi 2025**

*Empowering crypto investors with AI-powered insights*
