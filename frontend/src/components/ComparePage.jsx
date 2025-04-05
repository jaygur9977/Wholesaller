
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
// import WholesalerDetailCard from '../components/WholesalerCard';

// const ComparePage = () => {
//   const [selectedWholesalers, setSelectedWholesalers] = useState([]);
//   const [transportPrices, setTransportPrices] = useState({});
//   const navigate = useNavigate();

//   // Shop location (example)
//   const shopLocation = { lat: 40.7128, lng: -74.0060 };  // NYC, for example

//   useEffect(() => {
//     const selectedData = JSON.parse(localStorage.getItem('selectedWholesalers'));
//     if (selectedData) {
//       setSelectedWholesalers(selectedData);
//     }
//   }, []);

//   // Calculate transport price using Google Maps Directions API
//   const calculateTransportPrice = async (wholesaler) => {
//     const wholesalerLocation = { lat: wholesaler.lat, lng: wholesaler.lng };

//     const directionsService = new window.google.maps.DirectionsService();
//     const directionsRequest = {
//       origin: wholesalerLocation,
//       destination: shopLocation,
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     };

//     return new Promise((resolve, reject) => {
//       directionsService.route(directionsRequest, (result, status) => {
//         if (status === 'OK') {
//           // Calculate transport cost, example: $2 per km
//           const transportCost = Math.round(result.routes[0].legs[0].distance.value / 1000) * 2;
//           resolve(transportCost);
//         } else {
//           reject('Error fetching directions');
//         }
//       });
//     });
//   };

//   useEffect(() => {
//     const fetchTransportPrices = async () => {
//       const prices = {};
//       for (const wholesaler of selectedWholesalers) {
//         try {
//           const transportPrice = await calculateTransportPrice(wholesaler);
//           prices[wholesaler._id] = transportPrice;
//         } catch (error) {
//           console.error('Error calculating transport price:', error);
//         }
//       }
//       setTransportPrices(prices);
//     };

//     if (selectedWholesalers.length > 0) {
//       fetchTransportPrices();
//     }
//   }, [selectedWholesalers]);

//   const handleClearComparison = () => {
//     localStorage.removeItem('selectedWholesalers');
//     setSelectedWholesalers([]);
//     navigate('/');
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-6">Compare Wholesalers</h2>
//       {selectedWholesalers.length === 0 ? (
//         <p className="text-lg text-gray-500">No wholesalers selected for comparison.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {selectedWholesalers.map((wholesaler) => {
//             const transportPrice = transportPrices[wholesaler._id];

//             return (
//               <WholesalerDetailCard 
//                 key={wholesaler._id} 
//                 wholesaler={wholesaler}
//                 isSelected={true} // We can mark them as selected (just for styling)
//                 onSelect={() => {}}
//               >
//                 {/* Displaying transport price comparison */}
//                 <div>
//                   {transportPrice !== undefined ? (
//                     <div>
//                       <p><strong>Base Price:</strong> ${wholesaler.basePrice}</p>
//                       <p><strong>Transport Price:</strong> ${transportPrice}</p>
//                       <p><strong>Total Price:</strong> ${wholesaler.basePrice + transportPrice}</p>
//                     </div>
//                   ) : (
//                     <p>Loading transport price...</p>
//                   )}
//                 </div>
//               </WholesalerDetailCard>
//             );
//           })}
//         </div>
//       )}
//       <button
//         onClick={handleClearComparison}
//         className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
//       >
//         Clear Comparison
//       </button>
//     </div>
//   );
// };

// export default ComparePage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WholesalerDetailCard from './WholesalerCard';

const ComparePage = () => {
  const [selectedWholesalers, setSelectedWholesalers] = useState([]);
  const [vendorAddress, setVendorAddress] = useState(''); // Vendor address input
  const [workerCost, setWorkerCost] = useState(50); // Worker cost per trip
  const [transportCost, setTransportCost] = useState(null); // To store the transport cost
  const [loading, setLoading] = useState(false); // Loading state to show during API calls
  const apiKey = 'AIzaSyB8sq3U8_qnIn2A-RpWgBMkhd_hbcVueBE'; // Replace with your API key

  useEffect(() => {
    const selectedData = JSON.parse(localStorage.getItem('selectedWholesalers'));
    if (selectedData) {
      setSelectedWholesalers(selectedData);
    }
  }, []);

  const handleClearComparison = () => {
    localStorage.removeItem('selectedWholesalers');
    setSelectedWholesalers([]);
  };

  // Function to fetch geolocation (lat, lng) from the address using Google Maps Geocoding API
  const getCoordinates = async (address) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error('Geocoding failed:', response.data.status);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // Function to calculate transport cost based on distance between the vendor and wholesaler
  const calculateTransportCost = async (wholesaler) => {
    const vendorCoordinates = await getCoordinates(vendorAddress);
    const wholesalerCoordinates = await getCoordinates(wholesaler.address);

    if (vendorCoordinates && wholesalerCoordinates) {
      const origin = `${vendorCoordinates.lat},${vendorCoordinates.lng}`;
      const destination = `${wholesalerCoordinates.lat},${wholesalerCoordinates.lng}`;
      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

      try {
        const response = await axios.get(distanceUrl);
        if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
          const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
          const transportCost = (distance * 50) + workerCost; // Example transport cost calculation
          setTransportCost(transportCost);
        } else {
          console.error('Distance Matrix calculation failed:', response.data.status);
        }
      } catch (error) {
        console.error('Error calculating transport cost:', error);
      }
    }
  };

  const handleAddressChange = (event) => {
    setVendorAddress(event.target.value);
  };

  const handleCompare = () => {
    if (!vendorAddress) {
      alert('Please enter your address');
      return;
    }

    setLoading(true);
    setTransportCost(null); // Reset transport cost before calculation

    // Calculate transport costs for each wholesaler
    selectedWholesalers.forEach((wholesaler) => {
      calculateTransportCost(wholesaler);
    });
    setLoading(false);
  };


    const [isLoading, setIsLoading] = useState(false);
    
      const handleLoginRedirect = () => {
        setIsLoading(true);
        window.location.href = '/';
        window.location.pathname = '/';
      };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 ">Compare Wholesalers</h2>

      <button
          className="inline-flex items-center mb-3 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleLoginRedirect}
          disabled={isLoading}
          >
         {isLoading ? 'Redirecting...' : 'back'}

        </button>

      {/* Address Input */}
      <textarea
        value={vendorAddress}
        onChange={handleAddressChange}
        placeholder="Enter your address"
        rows={3}
        className="w-full p-2 mb-4 border rounded-md"
      />

      <button
        onClick={handleCompare}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
      >
        Compare
      </button>

      {loading ? (
        <p className="text-lg text-gray-500">Loading transport costs...</p>
      ) : (
        <p className="text-lg text-gray-500">Transport Cost: {transportCost ? `${transportCost} INR` : 'Not calculated'}</p>
      )}

      {selectedWholesalers.length === 0 ? (
        <p className="text-lg text-gray-500">No wholesalers selected for comparison.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedWholesalers.map((wholesaler) => (
            <WholesalerDetailCard
              key={wholesaler._id}
              wholesaler={wholesaler}
              isSelected={true}
              onSelect={() => {}}
              vendorAddress={vendorAddress}
              workerCost={workerCost}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleClearComparison}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
      >
        Clear Comparison
      </button>
    </div>
  );
};

export default ComparePage;
