import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, DollarSign, Users, Eye, Heart } from 'lucide-react';
import axios from 'axios';

const SchemeCard = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    crop: '',
    subsidyType: '',
    state: ''
  });

  // Mock data if API is not available
  const mockSchemes = [
    {
      id: 1,
      name: "PM-KISAN Samman Nidhi",
      shortDescription: "Income support to farmers through direct cash transfer",
      benefits: [
        "₹6,000 per year in three installments",
        "Direct bank transfer",
        "No paperwork required for enrolled farmers"
      ],
      eligibility: "Small and marginal farmers with landholding up to 2 hectares",
      crop: "all",
      subsidyType: "cash",
      state: "all",
      readMoreLink: "#"
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      shortDescription: "Crop insurance scheme providing financial support to farmers",
      benefits: [
        "Premium subsidy up to 90%",
        "Coverage for all crops",
        "Quick claim settlement"
      ],
      eligibility: "All farmers including sharecroppers and tenant farmers",
      crop: "all",
      subsidyType: "insurance",
      state: "all",
      readMoreLink: "#"
    },
    {
      id: 3,
      name: "Livestock Insurance Scheme",
      shortDescription: "Insurance coverage for livestock to protect farmers from losses",
      benefits: [
        "Coverage for cattle, buffalo, sheep, goat, pig",
        "Premium subsidy available",
        "Quick claim processing"
      ],
      eligibility: "Farmers and livestock owners",
      crop: "livestock",
      subsidyType: "insurance",
      state: "all",
      animalsInsured: ["Cattle", "Buffalo", "Sheep", "Goat", "Pig"],
      readMoreLink: "#"
    },
    {
      id: 4,
      name: "Soil Health Card Scheme",
      shortDescription: "Provides soil health information to farmers for better crop management",
      benefits: [
        "Free soil testing",
        "Nutrient management recommendations",
        "Improved crop productivity"
      ],
      eligibility: "All farmers",
      crop: "all",
      subsidyType: "service",
      state: "all",
      readMoreLink: "#"
    }
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, filters]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const apiUrl = import.meta.env.VITE_SCHEMES_API_URL;
      if (apiUrl) {
        const response = await axios.get(apiUrl);
        setSchemes(response.data);
      } else {
        // Use mock data if no API URL provided
        setSchemes(mockSchemes);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
      // Fallback to mock data
      setSchemes(mockSchemes);
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCrop = !filters.crop || scheme.crop === filters.crop || scheme.crop === 'all';
      const matchesSubsidy = !filters.subsidyType || scheme.subsidyType === filters.subsidyType;
      const matchesState = !filters.state || scheme.state === filters.state || scheme.state === 'all';

      return matchesSearch && matchesCrop && matchesSubsidy && matchesState;
    });
    
    setFilteredSchemes(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading schemes: {error}</p>
        <button 
          onClick={fetchSchemes}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Government Agriculture Schemes
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filters.crop}
              onChange={(e) => handleFilterChange('crop', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Crops</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="livestock">Livestock</option>
            </select>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filters.subsidyType}
              onChange={(e) => handleFilterChange('subsidyType', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Subsidy Types</option>
              <option value="cash">Cash Transfer</option>
              <option value="insurance">Insurance</option>
              <option value="loan">Loan</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All States</option>
              <option value="punjab">Punjab</option>
              <option value="haryana">Haryana</option>
              <option value="uttar-pradesh">Uttar Pradesh</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="kerala">Kerala</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="scheme-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-tight">
                  {scheme.name}
                </h3>
                <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                {scheme.shortDescription}
              </p>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  Benefits:
                </h4>
                <ul className="space-y-1">
                  {scheme.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                  {scheme.benefits.length > 2 && (
                    <li className="text-sm text-gray-500 dark:text-gray-400">
                      +{scheme.benefits.length - 2} more benefits
                    </li>
                  )}
                </ul>
              </div>

              {/* Animals Insured (for Livestock Insurance Scheme) */}
              {scheme.name === "Livestock Insurance Scheme" && scheme.animalsInsured && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-blue-600" />
                    Animals Insured:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {scheme.animalsInsured.map((animal, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-purple-600" />
                  Eligibility:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {scheme.eligibility}
                </p>
              </div>

              {/* Read More Button */}
              <button
                onClick={() => window.open(scheme.readMoreLink, '_blank')}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <Eye className="h-4 w-4" />
                <span>Read More</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No schemes found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchemeCard;
