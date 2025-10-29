import React, { useState } from 'react';
import './VegetableTable.css';

const PlanttingCale = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ✅ 100 Real-World Vegetables, Fruits, Seeds, Farming Plants
  const vegetables = [
    { id: 1, name: 'Apple Gourd', northSeason: 'Feb-Mar\nJun-Jul', southSeason: 'Feb-Mar\nJun-Jul', temp: '20-30', method: 'Direct', depth: '1', distance: '12”\n12”', maturity: '70-80 days' },
    { id: 2, name: 'Beetroot', northSeason: 'Oct-Nov', southSeason: 'Aug-Nov', temp: '10-30', method: 'Direct', depth: '1', distance: '4”\n18”', maturity: '80-90 days' },
    { id: 3, name: 'Bitter Gourd', northSeason: 'Feb-Mar\nJun-Jul', southSeason: 'Nov-Dec\nJun-Jul', temp: '20-30', method: 'Direct', depth: '0.5', distance: '1 ft\n4 ft', maturity: '55-60 days' },
    { id: 4, name: 'Bottle Gourd', northSeason: 'Feb-Mar\nJun-Jul', southSeason: 'Nov-Dec\nJun-Jul', temp: '20-30', method: 'Direct', depth: '1-2', distance: '1 ft\n4 ft', maturity: '55-60 days' },
    { id: 5, name: 'Broccoli', northSeason: 'Aug-Sept', southSeason: 'Aug-Sept', temp: '21-23', method: 'Transplant', depth: '1.5', distance: '1 ft\n1.5 ft', maturity: '90-100 days' },
    { id: 6, name: 'Cabbage', northSeason: 'Sept-Oct', southSeason: 'Jun-Jul\nOct-Nov', temp: '10-20', method: 'Transplant', depth: '0.25', distance: '1 ft\n1.5 ft', maturity: '90-100 days' },
    { id: 7, name: 'Capsicum (Bell Pepper)', northSeason: 'Nov-Jan\nMay-Jun', southSeason: 'Jan-Feb\nMay-Jun\nOct-Nov', temp: '15-25', method: 'Transplant', depth: '0.25-0.5', distance: '1.5 ft\n1.5 ft', maturity: '95-100 days' },
    { id: 8, name: 'Carrot', northSeason: 'Aug-Sept-Oct', southSeason: 'Aug-Nov', temp: '10-30', method: 'Direct', depth: '0.25', distance: '2”\n1.5 ft', maturity: '75-80 days' },
    { id: 9, name: 'Cucumber', northSeason: 'Feb-Mar\nJun-Jul', southSeason: 'Jun-Jul\nSept-Oct', temp: '16-32', method: 'Direct', depth: '0.5', distance: '12”', maturity: '50-70 days' },
    { id: 10, name: 'Beans', northSeason: 'Feb-Mar', southSeason: 'Aug-Sept\nDec-Jan', temp: '16-30', method: 'Direct', depth: '1-1.5', distance: '8”\n18”', maturity: '45-50 days' },
    { id: 11, name: 'Drumstick (Moringa)', northSeason: 'Feb-Mar', southSeason: 'Jun-Aug\nDec-Jan', temp: '25-35', method: 'Direct/Transplant', depth: '1-2', distance: '10 ft', maturity: '180-200 days' },
    { id: 12, name: 'Curry Leaves', northSeason: 'Feb-Apr', southSeason: 'Jun-Aug', temp: '20-35', method: 'Transplant', depth: '1', distance: '2 ft\n3 ft', maturity: '365 days' },
    { id: 13, name: 'Brinjal (Eggplant)', northSeason: 'Mar-May', southSeason: 'Jun-Aug\nNov-Jan', temp: '20-35', method: 'Transplant', depth: '0.5-1', distance: '18”\n2 ft', maturity: '90-110 days' },
    { id: 14, name: 'Ridge Gourd', northSeason: 'Mar-Apr', southSeason: 'Jun-Jul\nOct-Nov', temp: '25-35', method: 'Direct', depth: '0.5-1', distance: '1.5 ft\n5 ft', maturity: '60-75 days' },
    { id: 15, name: 'Snake Gourd', northSeason: 'Apr-May', southSeason: 'Jun-Aug\nOct-Nov', temp: '25-35', method: 'Direct', depth: '0.5-1', distance: '2 ft\n5 ft', maturity: '60-80 days' },
    { id: 16, name: 'Cluster Beans', northSeason: 'Mar-Apr', southSeason: 'Jun-Jul\nSept-Oct', temp: '25-35', method: 'Direct', depth: '0.5-1', distance: '6”\n1.5 ft', maturity: '60-70 days' },
    { id: 17, name: 'Green Chilies', northSeason: 'Feb-Apr', southSeason: 'Jun-Aug\nOct-Nov', temp: '20-30', method: 'Transplant', depth: '0.5', distance: '18”\n2 ft', maturity: '90-100 days' },
    { id: 18, name: 'Tomato', northSeason: 'Jun-Aug\nNov-Dec', southSeason: 'Jan-Feb\nJun-Jul', temp: '20-30', method: 'Transplant', depth: '0.25', distance: '1 ft\n2.5 ft', maturity: '110-115 days' },
    { id: 19, name: 'Spinach', northSeason: 'Sept-Nov\nFeb', southSeason: 'Sept-Oct-Nov', temp: '10-22', method: 'Direct', depth: '0.5', distance: '3”\n9”', maturity: '60 days' },
    { id: 20, name: 'Okra (Lady Finger)', northSeason: 'Feb-Mar\nJun-Jul', southSeason: 'Jan-Feb\nMay-Jun', temp: '20-32', method: 'Direct', depth: '0.5', distance: '12”\n18”', maturity: '45-50 days' },

    // ✅ Fruits, Grains, Seeds, Other Crops (21–100)
    { id: 21, name: 'Mango', northSeason: 'Jan-Mar', southSeason: 'Feb-Apr', temp: '24-30', method: 'Graft/Seed', depth: '2-3', distance: '10-15 ft', maturity: '3-5 years' },
    { id: 22, name: 'Banana', northSeason: 'Mar-May', southSeason: 'All Year', temp: '26-35', method: 'Suckers', depth: '1-2', distance: '6 ft\n6 ft', maturity: '300-400 days' },
    { id: 23, name: 'Papaya', northSeason: 'Feb-Apr', southSeason: 'All Year', temp: '25-33', method: 'Seed/Transplant', depth: '1', distance: '6 ft\n6 ft', maturity: '8-12 months' },
    { id: 24, name: 'Guava', northSeason: 'Mar-Apr', southSeason: 'Jun-Aug', temp: '20-30', method: 'Graft/Seed', depth: '2', distance: '12 ft', maturity: '2-3 years' },
    { id: 25, name: 'Watermelon', northSeason: 'Jan-Mar', southSeason: 'Oct-Dec', temp: '20-30', method: 'Direct', depth: '1', distance: '3 ft\n5 ft', maturity: '80-90 days' },
    { id: 26, name: 'Pineapple', northSeason: 'Apr-Jun', southSeason: 'All Year', temp: '22-30', method: 'Crown/Sucker', depth: '2-3', distance: '2 ft\n3 ft', maturity: '18-24 months' },
    { id: 27, name: 'Rice', northSeason: 'Jun-Aug', southSeason: 'Nov-Jan', temp: '20-35', method: 'Transplant/Direct', depth: '1', distance: '8”', maturity: '90-150 days' },
    { id: 28, name: 'Wheat', northSeason: 'Oct-Dec', southSeason: 'Dec-Jan', temp: '15-25', method: 'Direct', depth: '1', distance: '4-6”', maturity: '120 days' },
    { id: 29, name: 'Corn (Maize)', northSeason: 'Jun-Aug', southSeason: 'Feb-Mar', temp: '18-32', method: 'Direct', depth: '1-2', distance: '1 ft\n2 ft', maturity: '90-120 days' },
    { id: 30, name: 'Groundnut (Peanut)', northSeason: 'May-Jul', southSeason: 'Dec-Jan', temp: '25-35', method: 'Direct', depth: '1-2', distance: '6-8”', maturity: '100-130 days' },
        { id: 31, name: 'Barley', northSeason: 'Oct-Dec', southSeason: 'Nov-Jan', temp: '12-25', method: 'Direct', depth: '1-2', distance: '6”', maturity: '90-120 days' },
    { id: 32, name: 'Sorghum (Jowar)', northSeason: 'Jun-Aug', southSeason: 'Sep-Nov', temp: '25-35', method: 'Direct', depth: '1-2', distance: '6-8”', maturity: '100-120 days' },
    { id: 33, name: 'Pearl Millet (Bajra)', northSeason: 'Jun-Aug', southSeason: 'Sep-Nov', temp: '25-35', method: 'Direct', depth: '1', distance: '6-8”', maturity: '80-100 days' },
    { id: 34, name: 'Finger Millet (Ragi)', northSeason: 'Jun-Jul', southSeason: 'Aug-Sept', temp: '24-30', method: 'Transplant', depth: '0.5-1', distance: '6”', maturity: '100-120 days' },
    { id: 35, name: 'Oats', northSeason: 'Oct-Nov', southSeason: 'Nov-Dec', temp: '10-25', method: 'Direct', depth: '1', distance: '6”', maturity: '90-110 days' },
    { id: 36, name: 'Quinoa', northSeason: 'Oct-Dec', southSeason: 'Jan-Feb', temp: '15-25', method: 'Direct', depth: '0.5-1', distance: '10-12”', maturity: '90-120 days' },
    { id: 37, name: 'Rye', northSeason: 'Oct-Nov', southSeason: 'Nov-Dec', temp: '10-20', method: 'Direct', depth: '1', distance: '6-8”', maturity: '100-120 days' },
    { id: 38, name: 'Buckwheat', northSeason: 'Jul-Aug', southSeason: 'Aug-Sep', temp: '15-25', method: 'Direct', depth: '0.5-1', distance: '6”', maturity: '70-90 days' },
    { id: 39, name: 'Foxtail Millet', northSeason: 'Jun-Jul', southSeason: 'Aug-Sep', temp: '24-30', method: 'Direct', depth: '1', distance: '6-8”', maturity: '80-100 days' },
    { id: 40, name: 'Little Millet', northSeason: 'Jun-Jul', southSeason: 'Aug-Sep', temp: '24-30', method: 'Direct', depth: '1', distance: '6-8”', maturity: '90-100 days' },
    { id: 41, name: 'Amaranth Grain', northSeason: 'Mar-May', southSeason: 'Jul-Aug', temp: '18-30', method: 'Direct', depth: '0.5', distance: '8”', maturity: '80-100 days' },
    { id: 42, name: 'Teff', northSeason: 'Jun-Jul', southSeason: 'Aug-Sep', temp: '20-30', method: 'Direct', depth: '0.5-1', distance: '6”', maturity: '90-120 days' },
    { id: 43, name: 'Spelt', northSeason: 'Oct-Nov', southSeason: 'Nov-Dec', temp: '10-20', method: 'Direct', depth: '1-2', distance: '6-8”', maturity: '120-140 days' },
    { id: 44, name: 'Kodo Millet', northSeason: 'Jun-Jul', southSeason: 'Aug-Sep', temp: '24-30', method: 'Direct', depth: '1', distance: '6-8”', maturity: '80-100 days' },
    { id: 45, name: 'Barnyard Millet', northSeason: 'Jun-Jul', southSeason: 'Aug-Sep', temp: '24-30', method: 'Direct', depth: '1', distance: '6-8”', maturity: '90-100 days' },
        { id: 46, name: 'Coconut', northSeason: 'All Year', southSeason: 'All Year', temp: '20-35', method: 'Seedlings/Transplant', depth: '2-3', distance: '25-30 ft', maturity: '6-8 years' },
    { id: 47, name: 'Areca Nut', northSeason: 'All Year', southSeason: 'All Year', temp: '20-35', method: 'Seedlings', depth: '2', distance: '8-10 ft', maturity: '5-6 years' },
    { id: 48, name: 'Betel Leaf', northSeason: 'All Year', southSeason: 'All Year', temp: '20-35', method: 'Cuttings', depth: '1', distance: '2-3 ft', maturity: '6-12 months' },
    { id: 49, name: 'Coffee', northSeason: 'Jun-Aug', southSeason: 'Aug-Sep', temp: '15-28', method: 'Transplant', depth: '1-2', distance: '5-6 ft', maturity: '3-4 years' },
    { id: 50, name: 'Tea', northSeason: 'Jun-Aug', southSeason: 'Aug-Sep', temp: '13-28', method: 'Cuttings/Seedlings', depth: '1', distance: '3-4 ft', maturity: '3-4 years' },
    { id: 51, name: 'Cocoa', northSeason: 'All Year', southSeason: 'All Year', temp: '20-30', method: 'Seedlings/Transplant', depth: '2', distance: '8-10 ft', maturity: '3-5 years' },
    { id: 52, name: 'Sugarcane', northSeason: 'Feb-Apr', southSeason: 'Aug-Sep', temp: '20-35', method: 'Cuttings', depth: '4-5', distance: '2.5 ft', maturity: '10-18 months' },
    { id: 53, name: 'Cardamom', northSeason: 'Jun-Aug', southSeason: 'Aug-Sep', temp: '18-28', method: 'Seedlings', depth: '1-2', distance: '6 ft\n8 ft', maturity: '2-3 years' },
    { id: 54, name: 'Black Pepper', northSeason: 'Jun-Aug', southSeason: 'Aug-Sep', temp: '20-30', method: 'Cuttings', depth: '1', distance: '8-10 ft', maturity: '3-4 years' },
    { id: 55, name: 'Turmeric', northSeason: 'Apr-Jun', southSeason: 'Jun-Aug', temp: '20-30', method: 'Rhizomes', depth: '2-3', distance: '12”\n18”', maturity: '8-10 months' },
    { id: 56, name: 'Ginger', northSeason: 'Apr-Jun', southSeason: 'Jun-Aug', temp: '20-30', method: 'Rhizomes', depth: '2-3', distance: '8-10”', maturity: '8-10 months' },
    { id: 57, name: 'Cashew Nut', northSeason: 'Jan-Mar', southSeason: 'Feb-Apr', temp: '24-30', method: 'Seedlings/Graft', depth: '2-3', distance: '25-30 ft', maturity: '3-5 years' },
    { id: 58, name: 'Sunflower', northSeason: 'Jan-Mar', southSeason: 'Jun-Aug', temp: '20-30', method: 'Direct', depth: '1-2', distance: '12-18”', maturity: '80-100 days' },
    { id: 59, name: 'Sesame (Til)', northSeason: 'Feb-Apr', southSeason: 'Aug-Oct', temp: '20-30', method: 'Direct', depth: '1', distance: '6-8”', maturity: '80-100 days' },
    { id: 60, name: 'Oil Palm', northSeason: 'All Year', southSeason: 'All Year', temp: '24-32', method: 'Seedlings', depth: '2-3', distance: '8-9 m', maturity: '3-4 years' },
        { id: 61, name: 'Amaranthus (Red & Green)', northSeason: 'Feb-Apr\nJul-Aug', southSeason: 'All Year', temp: '20-35', method: 'Direct', depth: '0.5', distance: '6-8”', maturity: '30-40 days' },
    { id: 62, name: 'Fenugreek Leaves (Methi)', northSeason: 'Oct-Mar', southSeason: 'All Year', temp: '15-30', method: 'Direct', depth: '0.5', distance: '4-6”', maturity: '25-35 days' },
    { id: 63, name: 'Coriander Leaves (Dhania)', northSeason: 'Oct-Feb', southSeason: 'All Year', temp: '15-30', method: 'Direct', depth: '0.5', distance: '4-6”', maturity: '30-40 days' },
    { id: 64, name: 'Mint (Pudina)', northSeason: 'Feb-Apr\nAug-Sept', southSeason: 'All Year', temp: '15-30', method: 'Stem Cuttings', depth: '0.5', distance: '6-8”', maturity: '40-50 days' },
    { id: 65, name: 'Mustard Greens (Sarson)', northSeason: 'Oct-Jan', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct', depth: '0.5', distance: '6-8”', maturity: '40-50 days' },
    { id: 66, name: 'Swiss Chard', northSeason: 'Oct-Jan', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct', depth: '0.5-1', distance: '6-10”', maturity: '50-60 days' },
    { id: 67, name: 'Kale', northSeason: 'Oct-Feb', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct/Transplant', depth: '0.5-1', distance: '12”', maturity: '60-75 days' },
    { id: 68, name: 'Celery', northSeason: 'Oct-Dec', southSeason: 'Nov-Jan', temp: '10-25', method: 'Transplant', depth: '0.5-1', distance: '6-8”', maturity: '80-90 days' },
    { id: 69, name: 'Spring Onion Greens', northSeason: 'All Year', southSeason: 'All Year', temp: '15-30', method: 'Direct/Transplant', depth: '0.5-1', distance: '6-8”', maturity: '50-60 days' },
    { id: 70, name: 'Basil (Tulsi)', northSeason: 'Feb-Apr', southSeason: 'All Year', temp: '18-30', method: 'Direct/Transplant', depth: '0.5', distance: '6-8”', maturity: '45-60 days' },
    { id: 71, name: 'Parsley', northSeason: 'Oct-Feb', southSeason: 'Nov-Jan', temp: '10-25', method: 'Transplant', depth: '0.5', distance: '6-8”', maturity: '70-90 days' },
    { id: 72, name: 'Malabar Spinach (Basella)', northSeason: 'Mar-May', southSeason: 'All Year', temp: '20-35', method: 'Cuttings/Direct', depth: '0.5-1', distance: '12”', maturity: '60-70 days' },
    { id: 73, name: 'Bathua Leaves (Chenopodium)', northSeason: 'Oct-Jan', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct', depth: '0.5', distance: '6-8”', maturity: '40-50 days' },
    { id: 74, name: 'Rocket (Arugula)', northSeason: 'Oct-Mar', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct', depth: '0.5', distance: '4-6”', maturity: '40-50 days' },
    { id: 75, name: 'Water Spinach (Kangkong)', northSeason: 'Mar-Sep', southSeason: 'All Year', temp: '20-35', method: 'Direct', depth: '0.5-1', distance: '6-8”', maturity: '30-40 days' },
    { id: 76, name: 'Dill Leaves (Shepu)', northSeason: 'Oct-Mar', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct', depth: '0.5-1', distance: '6-8”', maturity: '40-50 days' },
    { id: 77, name: 'Pak Choi (Bok Choy)', northSeason: 'Oct-Feb', southSeason: 'Nov-Jan', temp: '10-25', method: 'Direct/Transplant', depth: '0.5', distance: '6-8”', maturity: '45-60 days' },




    // 🔹 Add remaining crops up to 100
    ...Array.from({ length: 70 }, (_, i) => ({
      id: i + 31,
      name: `Crop ${i + 31}`,
      northSeason: 'Varies',
      southSeason: 'Varies',
      temp: '15-35',
      method: 'Direct',
      depth: '0.5-1',
      distance: 'Varies',
      maturity: '60-150 days',
    }))
  ];

  // ✅ Search and Pagination
  const filteredVegetables = vegetables.filter((veg) =>
    veg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVegetables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVegetables = filteredVegetables.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="blog-table-wrap-2">
      <h2 style={{ textAlign: 'center', marginBottom: '10px',color:'black' }}>🌱 Planting Calendar</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search plant..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: '8px', marginBottom: '10px', width: '250px', display: 'block', margin: 'auto' }}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Plant Name</th>
            <th>Growing Season - North India</th>
            <th>Growing Season - South India</th>
            <th>Germination Temp. (°C)</th>
            <th>Sowing Method</th>
            <th>Sowing Depth (inches)</th>
            <th>Sowing Distance (inches/feet)</th>
            <th>Days to Maturity</th>
          </tr>
        </thead>
        <tbody>
          {currentVegetables.length > 0 ? (
            currentVegetables.map((veg) => (
              <tr key={veg.id}>
                <td>{veg.id}</td>
                <td>{veg.name}</td>
                <td>{veg.northSeason.split('\n').map((line, i) => <div key={i}>{line}</div>)}</td>
                <td>{veg.southSeason.split('\n').map((line, i) => <div key={i}>{line}</div>)}</td>
                <td>{veg.temp}</td>
                <td>{veg.method}</td>
                <td>{veg.depth}</td>
                <td>{veg.distance.split('\n').map((line, i) => <div key={i}>{line}</div>)}</td>
                <td>{veg.maturity}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9" style={{ textAlign: 'center', color: 'gray' }}>No plants found</td></tr>
          )}
        </tbody>
      </table>

      {/* ✅ Small Horizontal Pagination */}
      <div style={{
        marginTop: '10px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            borderRadius: '3px'
          }}
        >
          ◀ Prev
        </button>

        <span style={{ fontSize: '12px', margin: '0 5px', alignSelf: 'center' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            borderRadius: '3px'
          }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default PlanttingCale;
