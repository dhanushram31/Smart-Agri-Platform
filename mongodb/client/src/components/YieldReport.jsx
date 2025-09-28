import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Wheat } from 'lucide-react';
import axios from 'axios';

const YieldReport = () => {
  const [yieldData, setYieldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  // Mock yield data
  const mockYieldData = [
    {
      crop: 'Rice',
      yield: 4200,
      lastYearYield: 3980,
      growth: 5.5,
      unit: 'kg/hectare'
    },
    {
      crop: 'Wheat',
      yield: 3450,
      lastYearYield: 3280,
      growth: 5.2,
      unit: 'kg/hectare'
    },
    {
      crop: 'Cotton',
      yield: 575,
      lastYearYield: 530,
      growth: 8.5,
      unit: 'kg/hectare'
    },
    {
      crop: 'Sugarcane',
      yield: 78500,
      lastYearYield: 76200,
      growth: 3.0,
      unit: 'kg/hectare'
    },
    {
      crop: 'Maize',
      yield: 2850,
      lastYearYield: 2950,
      growth: -3.4,
      unit: 'kg/hectare'
    },
    {
      crop: 'Jowar',
      yield: 1250,
      lastYearYield: 1180,
      growth: 5.9,
      unit: 'kg/hectare'
    },
    {
      crop: 'Bajra',
      yield: 1480,
      lastYearYield: 1420,
      growth: 4.2,
      unit: 'kg/hectare'
    },
    {
      crop: 'Groundnut',
      yield: 1890,
      lastYearYield: 1750,
      growth: 8.0,
      unit: 'kg/hectare'
    }
  ];

  useEffect(() => {
    fetchYieldData();
  }, []);

  const fetchYieldData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_YIELD_API_URL;
      if (apiUrl) {
        const response = await axios.get(apiUrl);
        setYieldData(response.data);
      } else {
        // Use mock data
        setYieldData(mockYieldData);
      }
    } catch (err) {
      console.error('Error fetching yield data:', err);
      setYieldData(mockYieldData);
    } finally {
      setLoading(false);
    }
  };

  const formatYield = (yieldValue, unit) => {
    if (yieldValue >= 1000) {
      return `${(yieldValue / 1000).toFixed(1)}K ${unit}`;
    }
    return `${yieldValue} ${unit}`;
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          <p className="text-blue-600">
            Yield: {formatYield(data.yield, data.unit)}
          </p>
          <p className={`flex items-center ${getGrowthColor(data.growth)}`}>
            {getGrowthIcon(data.growth)}
            <span className="ml-1">Growth: {data.growth > 0 ? '+' : ''}{data.growth}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Wheat className="mr-2 h-6 w-6 text-green-600" />
            Yearly Yield Report
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Crop yield performance and growth analysis
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              viewMode === 'chart'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <BarChart3 className="mr-1 h-4 w-4" />
            Chart View
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            Total Crops
          </h3>
          <p className="text-2xl font-bold text-green-600">{yieldData.length}</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            Avg Growth
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {(yieldData.reduce((sum, crop) => sum + crop.growth, 0) / yieldData.length).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
            Best Performer
          </h3>
          <p className="text-xl font-bold text-purple-600">
            {yieldData.find(crop => crop.growth === Math.max(...yieldData.map(c => c.growth)))?.crop}
          </p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
            Positive Growth
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {yieldData.filter(crop => crop.growth > 0).length}/{yieldData.length}
          </p>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Crop</th>
                <th className="px-6 py-3">Current Yield</th>
                <th className="px-6 py-3">Last Year</th>
                <th className="px-6 py-3">Growth %</th>
                <th className="px-6 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {yieldData.map((crop, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {crop.crop}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatYield(crop.yield, crop.unit)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatYield(crop.lastYearYield, crop.unit)}
                  </td>
                  <td className={`px-6 py-4 font-semibold ${getGrowthColor(crop.growth)}`}>
                    {crop.growth > 0 ? '+' : ''}{crop.growth}%
                  </td>
                  <td className="px-6 py-4">
                    {getGrowthIcon(crop.growth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={yieldData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="crop" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="yield" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default YieldReport;
