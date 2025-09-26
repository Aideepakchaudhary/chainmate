import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [messageCount, setMessageCount] = useState(0);

  const handleMessage = (message: string) => {
    setMessageCount(prev => prev + 1);
  };

  return (
    <>
      <Head>
        <title>ChainMate - AI Crypto Analyst</title>
        <meta name="description" content="AI-powered crypto portfolio analysis powered by The Graph" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ChainMate</h1>
                  <p className="text-sm text-gray-500">AI Crypto Analyst</p>
                </div>
              </div>
              
              <nav className="flex items-center space-x-4">
                <Link 
                  href="/portfolio" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Portfolio
                </Link>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-sm text-gray-500">
                  Powered by The Graph
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Crypto Portfolio Analysis
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get instant insights on any wallet. Just ask in natural language.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Portfolio Analysis</h3>
                <p className="text-sm text-gray-600">
                  Analyze any wallet's holdings, value, and diversity score
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations and portfolio health tips
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Data</h3>
                <p className="text-sm text-gray-600">
                  Live blockchain data from The Graph's Token API
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg border h-[600px] flex flex-col">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      ChainMate AI Assistant
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {messageCount > 0 && `${messageCount} queries processed`}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ChatInterface onMessage={handleMessage} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  Built for ETHGlobal New Delhi
                </p>
                <div className="w-px h-4 bg-gray-300"></div>
                <p className="text-sm text-gray-600">
                  Powered by The Graph Token API
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link 
                  href="/portfolio" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Direct Portfolio Analysis
                </Link>
                <a 
                  href="https://thegraph.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  The Graph
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                ChainMate provides portfolio analysis for educational purposes. 
                Always do your own research before making investment decisions.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}