import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const LoginSignup = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [role, setRole] = useState(null); 
  const [isVendorOrWholesalerModalOpen, setIsVendorOrWholesalerModalOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [shopPhoto, setShopPhoto] = useState(null); 
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [basePrice, setbasePrice] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSignupClick = () => {
    setShowAuthModal(true);
  };

  // Handle role selection (vendor or wholesaler)
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setIsVendorOrWholesalerModalOpen(true);
    setShowAuthModal(false);
  };

  // Register new user
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Prepare form data to send to the backend
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('fullName', fullName);
    formData.append('basePrice', basePrice);
    formData.append('shopName', shopName);
    formData.append('category', category);
    formData.append('shopPhoto', shopPhoto);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('pincode', pincode);
    formData.append('address', address);

    try {
      // POST request to your backend API
      const response = await axios.post('http://localhost:5000/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        }
      });

      // If registration is successful, alert and redirect
      alert('Registration successful!');
      setIsVendorOrWholesalerModalOpen(false); // Close the modal after registration
      setErrorMessage(''); // Clear error message on successful registration
      // history.push('/'); // Uncomment if you want to redirect to home after registration
    } catch (error) {
      // Check if the error response contains a message and set it as an error
      console.error('Error during registration:', error);
      if (error.response && error.response.data) {
        // Show error message from backend (if exists)
        setErrorMessage(error.response.data.error || 'Error during registration. Please try again!');
      } else {
        // Show a generic error message
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-semibold text-center">Sign Up or Sign In</h2>
      <button
        onClick={handleSignupClick}
        className="bg-indigo-600 text-white px-6 py-3 rounded-md mt-4 mx-auto block hover:bg-indigo-700 transition duration-300"
      >
        Sign Up / Sign In
      </button>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onRequestClose={() => setShowAuthModal(false)}
        contentLabel="Authentication"
        className="modal-content max-w-sm mx-auto p-6 bg-white rounded-md shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Choose Your Role</h2>
          <button
            onClick={() => handleRoleSelection('vendor')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 w-full mb-4"
          >
            Sign Up as Vendor
          </button>
          <button
            onClick={() => handleRoleSelection('wholesaler')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 w-full"
          >
            Sign Up as Wholesaler
          </button>
        </div>
      </Modal>

      {/* Vendor or Wholesaler Registration Modal */}
      <Modal
        isOpen={isVendorOrWholesalerModalOpen}
        onRequestClose={() => setIsVendorOrWholesalerModalOpen(false)}
        contentLabel="Register as Vendor or Wholesaler"
        className="modal-content max-w-sm mx-auto p-6 bg-white rounded-md shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            {role === 'vendor' ? 'Register as Vendor' : 'Register as Wholesaler'}
          </h2>
          <form className="space-y-4 w-full" onSubmit={handleRegister}>
            <input
              type="file"
              accept="image/*"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Upload Shop Photo"
              onChange={(e) => setShopPhoto(e.target.files[0])} // Handle file input
            />
            <input
              type="email"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            />
              <input
                type="text"
                className="bg-gray-200 p-2 rounded-md w-full"
                placeholder="Base price"
                onChange={(e) => setbasePrice(e.target.value)}
              />
            <input
              type="text"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Shop Name"
              onChange={(e) => setShopName(e.target.value)}
            />
            <input
              type="text"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="text"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Pincode"
              onChange={(e) => setPincode(e.target.value)}
            />
            <textarea
              className="bg-gray-200 p-2 rounded-md w-full"
              placeholder="Permanent Address"
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>

            <select
              className="bg-gray-200 p-2 rounded-md w-full mb-4"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="plastics">Plastics</option>
              <option value="toys">Toys</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="hardware">Hardware</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md w-full hover:bg-indigo-700 transition duration-300"
            >
              Register
            </button>
          </form>

          {/* Error message display */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-4">
              <p>please change email</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LoginSignup;
