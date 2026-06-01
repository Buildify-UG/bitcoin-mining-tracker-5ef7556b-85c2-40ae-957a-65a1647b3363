import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Cpu, TrendingUp, Wallet, Play, Pause, Settings, Activity } from 'lucide-react';

interface MiningStats {
  hashrate: number;
  totalEarnings: number;
  blocksFound: number;
  difficulty: number;
  temperature: number;
  efficiency: number;
}

interface ChartData {
  time: string;
  hashrate: number;
  earnings: number;
  temperature: number;
}

const Index = () => {
  const [isMining, setIsMining] = useState(false);
  const [stats, setStats] = useState<MiningStats>({
    hashrate: 0,
    totalEarnings: 0,
    blocksFound: 0,
    difficulty: 28.5,
    temperature: 45,
    efficiency: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([
    { time: '00:00', hashrate: 0, earnings: 0, temperature: 35 },
    { time: '02:00', hashrate: 0, earnings: 0, temperature: 38 },
    { time: '04:00', hashrate: 0, earnings: 0, temperature: 40 },
    { time: '06:00', hashrate: 0, earnings: 0, temperature: 42 },
    { time: '08:00', hashrate: 0, earnings: 0, temperature: 45 },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMining) {
      interval = setInterval(() => {
        setStats((prev) => {
          const newHashrate = Math.random() * 150 + 100;
          const newEarnings = prev.totalEarnings + (newHashrate / 1000) * 0.00001;
          const newTemp = Math.random() * 15 + 50;

          return {
            ...prev,
            hashrate: newHashrate,
            totalEarnings: newEarnings,
            blocksFound: Math.random() > 0.95 ? prev.blocksFound + 1 : prev.blocksFound,
            temperature: newTemp,
            efficiency: (newHashrate / 200) * 100,
          };
        });

        setChartData((prev) => {
          const newData = [...prev.slice(1)];
          const lastTime = parseInt(prev[prev.length - 1].time.split(':')[0]);
          const newTime = ((lastTime + 2) % 24).toString().padStart(2, '0');
          
          newData.push({
            time: `${newTime}:00`,
            hashrate: stats.hashrate,
            earnings: stats.totalEarnings,
            temperature: stats.temperature,
          });
          
          return newData;
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isMining, stats.hashrate, stats.totalEarnings, stats.temperature]);

  const toggleMining = () => {
    setIsMining(!isMining);
  };

  const formatHashrate = (mh: number) => {
    if (mh >= 1000) return `${(mh / 1000).toFixed(2)} GH/s`;
    return `${mh.toFixed(2)} MH/s`;
  };

  const formatBitcoin = (btc: number) => {
    return `₿ ${btc.toFixed(8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Bitcoin Miner</h1>
                <p className="text-slate-400">Professional Mining Dashboard</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={toggleMining}
                className={`gap-2 px-6 py-2 text-lg font-semibold transition-all ${
                  isMining
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isMining ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Stop Mining
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Mining
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${
            isMining
              ? 'bg-green-900/20 border-green-700 text-green-300'
              : 'bg-slate-700/20 border-slate-600 text-slate-400'
          }`}>
            <Activity className={`w-5 h-5 ${isMining ? 'animate-pulse' : ''}`} />
            <span className="font-semibold">
              {isMining ? 'Mining Active' : 'Mining Inactive'}
            </span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Hashrate Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                Hashrate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {formatHashrate(stats.hashrate)}
              </div>
              <p className="text-xs text-slate-400">Current mining speed</p>
            </CardContent>
          </Card>

          {/* Earnings Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-500" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {formatBitcoin(stats.totalEarnings)}
              </div>
              <p className="text-xs text-slate-400">
                ${(stats.totalEarnings * 43000).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Blocks Found Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Blocks Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.blocksFound}
              </div>
              <p className="text-xs text-slate-400">Network blocks mined</p>
            </CardContent>
          </Card>

          {/* Efficiency Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.efficiency.toFixed(1)}%
              </div>
              <Progress value={stats.efficiency} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hashrate Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Hashrate History</CardTitle>
              <CardDescription>24-hour mining performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hashrate"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorHashrate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Temperature Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">System Temperature</CardTitle>
              <CardDescription>GPU and CPU temperatures</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Network Info */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Network Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Difficulty</p>
                <p className="text-lg font-semibold text-white">{stats.difficulty.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Pool Fee</p>
                <p className="text-lg font-semibold text-white">1.0%</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Shares Accepted</p>
                <p className="text-lg font-semibold text-white">2,847</p>
              </div>
            </CardContent>
          </Card>

          {/* Hardware Stats */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Hardware</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">GPU Temperature</p>
                <p className="text-lg font-semibold text-white">{stats.temperature.toFixed(0)}°C</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Power Usage</p>
                <p className="text-lg font-semibold text-white">285W</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">GPU Load</p>
                <p className="text-lg font-semibold text-white">95%</p>
              </div>
            </CardContent>
          </Card>

          {/* Profitability */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Profitability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Daily Earnings</p>
                <p className="text-lg font-semibold text-green-400">
                  ${(stats.totalEarnings * 43000 * 24).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Daily Electricity Cost</p>
                <p className="text-lg font-semibold text-orange-400">$8.50</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Net Daily Profit</p>
                <p className="text-lg font-semibold text-emerald-400">
                  ${((stats.totalEarnings * 43000 * 24) - 8.5).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
