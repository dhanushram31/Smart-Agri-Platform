import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';

const GDPChart = () => {
  const [gdpData, setGdpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock GDP data
  const mockGdpData = [
    { year: 2018, gdp: 2.7, growth: 0.2 },
    { year: 2019, gdp: 2.9, growth: 7.4 },
    { year: 2020, gdp: 3.1, growth: 6.9 },
    { year: 2021, gdp: 3.3, growth: 6.5 },
    { year: 2022, gdp: 3.6, growth: 9.1 },
    { year: 2023, gdp: 3.8, growth: 5.6 },
    { year: 2024, gdp: 4.1, growth: 7.9 },
    { year: 2025, gdp: 4.3, growth: 4.9 }
  ];

  useEffect(() => {
    fetchGDPData();
  }, []);

  const fetchGDPData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_GDP_API_URL;
      if (apiUrl) {
        const response = await axios.get(apiUrl);
        setGdpData(response.data);
      } else {
        // Use mock data
        setGdpData(mockGdpData);
      }
    } catch (err) {
      console.error('Error fetching GDP data:', err);
      setGdpData(mockGdpData);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const currentYearData = gdpData.find(data => data.year === currentYear);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{`Year: ${label}`}</p>
          <p className="text-green-600">
            {`GDP: ₹${data.gdp} Trillion`}
          </p>
          <p className="text-blue-600">
            {`Growth: ${data.growth}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.year === currentYear) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#ef4444"
          stroke="#fff"
          strokeWidth={2}
          className="animate-pulse"
        />
      );
    }
    return <circle cx={cx} cy={cy} r={3} fill="#10b981" />;
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
            <TrendingUp className="mr-2 h-6 w-6 text-green-600" />
            Agriculture GDP Trend
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            India's Agricultural Gross Domestic Product over the years
          </p>
        </div>
        
        {currentYearData && (
          <div className="text-right">
            <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-end">
                <Calendar className="mr-1 h-4 w-4" />
                Current Year ({currentYear})
              </p>
              <p className="text-2xl font-bold text-green-600 flex items-center justify-end">
                <DollarSign className="mr-1 h-5 w-5" />
                ₹{currentYearData.gdp}T
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Growth: +{currentYearData.growth}%
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={gdpData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `₹${value}T`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="gdp"
              stroke="#10b981"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            Average Growth
          </h3>
          <p className="text-xl font-bold text-green-600">
            {(gdpData.reduce((sum, data) => sum + data.growth, 0) / gdpData.length).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            Highest GDP
          </h3>
          <p className="text-xl font-bold text-blue-600">
            ₹{Math.max(...gdpData.map(data => data.gdp))}T
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
            Best Growth Year
          </h3>
          <p className="text-xl font-bold text-purple-600">
            {gdpData.find(data => data.growth === Math.max(...gdpData.map(d => d.growth)))?.year}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GDPChart;
