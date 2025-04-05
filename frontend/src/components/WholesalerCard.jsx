
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const WholesalerDetailCard = ({ wholesaler, isSelected, onSelect }) => {
//   const [workers, setWorkers] = useState(1); // Default to 1 worker
//   const [transportPrice, setTransportPrice] = useState(0); // Transport price state

//   // Handle worker count change
//   const handleWorkerChange = (e) => {
//     setWorkers(parseInt(e.target.value));
//   };

//   // Fetch distance and calculate transport price
//   const calculateTransportPrice = async () => {
//     // Default shop location (for example, using shop's pin code, city, and state)
//     const shopLocation = { lat: 28.7041, lng: 77.1025 }; // Example shop location: Delhi (lat, lng)

//     // Wholesaler's location (extract latitude and longitude from wholesaler data)
//     const wholesalerLocation = {
//       lat: wholesaler.lat, // Assuming `lat` and `lng` exist in wholesaler data
//       lng: wholesaler.lng,
//     };

//     try {
//       // Fetch the distance using the Google Maps Distance Matrix API
//       const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
//         params: {
//           origins: `${wholesalerLocation.lat},${wholesalerLocation.lng}`,
//           destinations: `${shopLocation.lat},${shopLocation.lng}`,
//           key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API Key
//         },
//       });

//       const distanceInKm = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to km
//       const fuelCost = (distanceInKm / 10) * 100; // Assuming 1 liter per 10 km, ₹100 per liter

//       // Calculate transport price
//       const basePrice = wholesaler.basePrice;
//       const workerCost = workers * 50; // ₹50 per worker
//       const totalTransportCost = basePrice + workerCost + fuelCost;

//       setTransportPrice(totalTransportCost);
//     } catch (error) {
//       console.error("Error calculating transport price:", error);
//     }
//   };

//   // Recalculate transport price whenever workers change
//   useEffect(() => {
//     calculateTransportPrice();
//   }, [workers]);

//   return (
//     <div
//       className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 cursor-pointer`}
//       onClick={onSelect}
//     >
//       <div className="flex justify-between items-start mb-2">
//         <h3 className="text-xl font-semibold text-gray-800">{wholesaler.name}</h3>
//         {isSelected && (
//           <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
//             Selected
//           </span>
//         )}
//       </div>
//       <p className="text-gray-600 mb-1">
//         <span className="font-medium">Business:</span> {wholesaler.shopName}
//       </p>
//       <p className="text-gray-600 mb-1">
//         <span className="font-medium">Location:</span> {wholesaler.city}, {wholesaler.state}
//       </p>
//       <p className="text-gray-600 mb-3">
//         <span className="font-medium">Category:</span> {wholesaler.category}
//       </p>
//       <p className="text-gray-600 mb-3">
//         <span className="font-medium">Base price:</span> ₹{wholesaler.basePrice}
//       </p>
//       <p className="text-gray-600 mb-1">
//         <span className="font-medium">Address:</span> {wholesaler.address}
//       </p>

//       {/* Worker Selection */}
//       <div className="mt-4 mb-3 flex justify-between items-center">
//         <label htmlFor="workers" className="font-medium">Workers</label>
//         <input
//           id="workers"
//           type="number"
//           value={workers}
//           min="1"
//           onChange={handleWorkerChange}
//           className="w-16 p-2 border border-gray-300 rounded-md"
//         />
//       </div>

//       {/* Transport Price */}
//       <div className="mt-2">
//         <p className="font-medium">Transport Price:</p>
//         <p className="text-gray-600">₹{transportPrice.toFixed(2)}</p>
//       </div>

//       {/* Add to Compare Button */}
//       <button
//         className={`w-full py-2 rounded-md ${isSelected ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition`}
//       >
//         {isSelected ? 'Added to Compare' : 'Add to Compare'}
//       </button>
//     </div>
//   );
// };

// export default WholesalerDetailCard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WholesalerDetailCard = ({ wholesaler, isSelected, onSelect, vendorAddress, workerCost }) => {
  const [transportPrice, setTransportPrice] = useState(null);
  const [vendorCoordinates, setVendorCoordinates] = useState(null);
  const [wholesalerCoordinates, setWholesalerCoordinates] = useState(null);

  const apiKey = 'AIzaSyB8sq3U8_qnIn2A-RpWgBMkhd_hbcVueBE'; // Replace with your API key

  useEffect(() => {
    if (vendorAddress && wholesaler.address) {
      // Step 1: Geocode Vendor's Address
      const getCoordinates = async (address) => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        try {
          const response = await axios.get(geocodeUrl);
          const { lat, lng } = response.data.results[0].geometry.location;
          return { lat, lng };
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      };

      // Get Vendor Coordinates
      getCoordinates(vendorAddress).then(setVendorCoordinates);

      // Get Wholesaler Coordinates
      getCoordinates(wholesaler.address).then(setWholesalerCoordinates);
    }
  }, [vendorAddress, wholesaler.address]);

  useEffect(() => {
    if (vendorCoordinates && wholesalerCoordinates) {
      // Step 2: Calculate Distance using the Distance Matrix API
      const calculateTransportCost = async () => {
        const origin = `${vendorCoordinates.lat},${vendorCoordinates.lng}`;
        const destination = `${wholesalerCoordinates.lat},${wholesalerCoordinates.lng}`;
        const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

        try {
          const response = await axios.get(distanceUrl);
          const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
          const transportCost = (distance * 50) + workerCost; // Transport cost calculation (e.g., per kilometer)
          setTransportPrice(transportCost);
        } catch (error) {
          console.error('Error calculating transport cost:', error);
        }
      };
      calculateTransportCost();
    }
  }, [vendorCoordinates, wholesalerCoordinates, workerCost]);

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{wholesaler.name}</h3>
        {isSelected && (
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Business:</span> {wholesaler.shopName}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Location:</span> {wholesaler.city}, {wholesaler.state}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Category:</span> {wholesaler.category}
      </p>
      <p className="text-gray-600 mb-3">
        <span className="font-medium">Base Price:</span> {wholesaler.basePrice}
      </p>
      <p className="text-gray-600 mb-3">
        <span className="font-medium">Transport Cost:</span> {transportPrice ? `${transportPrice} INR` : 'Loading...'}
      </p>
      <button
        className={`w-full py-2 rounded-md ${isSelected ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition`}
      >
        {isSelected ? 'Added to Compare' : 'Add to Compare'}
      </button>
    </div>
  );
};

export default WholesalerDetailCard;
