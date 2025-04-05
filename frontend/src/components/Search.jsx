
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WholesalerDetailCard from '../components/WholesalerCard';

const App = () => {
  const [allWholesalers, setAllWholesalers] = useState([]);
  const [filteredWholesalers, setFilteredWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    state: '',
    city: ''
  });
  const [selectedWholesalers, setSelectedWholesalers] = useState([]);
  const navigate = useNavigate();



  const handleClearSelection = () => {
    localStorage.removeItem('selectedWholesalers');
    setSelectedWholesalers([]);
  };


  // Fetch ALL wholesalers
  useEffect(() => {
    const fetchAllWholesalers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://wholesaller.onrender.com/api/users/search', {
          params: { role: 'wholesaler' }
        });
        setAllWholesalers(response.data.data);
        setFilteredWholesalers(response.data.data);
      } catch (error) {
        console.error('Error fetching wholesalers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllWholesalers();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    setLoading(true);
    const filtered = allWholesalers.filter((wholesaler) => {
      const categoryMatch = 
        filters.category.length === 0 || 
        filters.category.includes(wholesaler.category);
      const stateMatch = 
        !filters.state || 
        wholesaler.state.toLowerCase().includes(filters.state.toLowerCase());
      const cityMatch = 
        !filters.city || 
        wholesaler.city.toLowerCase().includes(filters.city.toLowerCase());
      return categoryMatch && stateMatch && cityMatch;
    });
    setFilteredWholesalers(filtered);
    setLoading(false);
  };

  // Toggle wholesaler selection
  const toggleWholesalerSelection = (id) => {
    setSelectedWholesalers(prev => 
      prev.includes(id) 
        ? prev.filter(wholesalerId => wholesalerId !== id) 
        : [...prev, id]
    );
  };

 
  const handleCompare = () => {
    // Save selected wholesalers full data to localStorage
    const selectedData = allWholesalers.filter((wholesaler) => 
      selectedWholesalers.includes(wholesaler._id)
    );
    localStorage.setItem('selectedWholesalers', JSON.stringify(selectedData));
    
    // Navigate to the compare page
    navigate('/compare');
  };
  


  const clearSelections = () => {
    setSelectedWholesalers([]);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'category') {
      setFilters(prev => ({
        ...prev,
        category: checked 
          ? [...prev.category, value] 
          : prev.category.filter(c => c !== value)
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({ category: [], state: '', city: '' });
    setFilteredWholesalers(allWholesalers);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6">
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        
        {/* Categories Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Categories</h3>
          {['plastics', 'toys', 'fruits', 'vegetables', 'hardware'].map((cat) => (
            <label key={cat} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="category"
                value={cat}
                checked={filters.category.includes(cat)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4 text-indigo-600 rounded"
              />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))}
        </div>

        {/* Location Filters */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Location</h3>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="e.g., California"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="e.g., Los Angeles"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
          >
            Clear
          </button>
        </div>
      </div>
    
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Wholesalers ({filteredWholesalers.length})
          </h2>
          {selectedWholesalers.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={handleCompare}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Compare ({selectedWholesalers.length})
              </button>
              <button 
                onClick={clearSelections}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWholesalers.length > 0 ? (
              filteredWholesalers.map((wholesaler) => (
                <WholesalerDetailCard 
                  key={wholesaler._id} 
                  wholesaler={wholesaler}
                  isSelected={selectedWholesalers.includes(wholesaler._id)}
                  onSelect={() => toggleWholesalerSelection(wholesaler._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">No wholesalers match your filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-indigo-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;