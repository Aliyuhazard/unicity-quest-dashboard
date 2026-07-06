import { useState, useEffect } from 'react';
import { Wallet, RefreshCw, Plus, Send } from 'lucide-react';

function App() {
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState('Click Connect Wallet');
  const [logs, setLogs] = useState<string[]>(['Dashboard initialized']);
  const [connected, setConnected] = useState(false);

  const addLog = (msg: string) => setLogs(p => [`${new Date().toLocaleTimeString()}: ${msg}`, ...p.slice(0, 8)]);

  const connectRealWallet = async () => {
    addLog('Connecting to Sphere Wallet...');
    setStatus('Connecting...');

    try {
      // Real SDK connection attempt
      const { Sphere } = await import('@unicitylabs/sphere-sdk');
      const { sphere } = await Sphere.init({
        network: 'testnet',
        autoGenerate: true,
      });

      const assets = await sphere.payments.getAssets();
      const total = assets.reduce((sum: number, a: any) => sum + parseFloat(a.totalAmount || '0'), 0);

      setBalance(total.toFixed(0));
      setConnected(true);
      setStatus('✅ Connected to Unicity Testnet');
      addLog('Wallet connected successfully!');
    } catch (e) {
      addLog('SDK connection failed (using demo mode)');
      setStatus('Demo Mode (Testnet)');
      setBalance('12500');
      setConnected(true);
    }
  };

  useEffect(() => {
    // Auto try connect
    setTimeout(connectRealWallet, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="text-blue-400" /> Unicity Quest Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Your Balance</p>
            <p className="text-5xl font-mono font-bold mt-2">{balance} UCT</p>
            <p className="text-green-400 text-sm mt-4">• {status}</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <button 
              onClick={connectRealWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-lg font-medium"
            >
              🔗 Connect Wallet
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => addLog('Minting...')} className="bg-blue-600 py-4 rounded-xl">+ Mint Test Tokens</button>
            <button onClick={() => addLog('Sending...')} className="bg-purple-600 py-4 rounded-xl">Send Test Tokens</button>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">Activity Log</h3>
          <div className="bg-black/50 p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;