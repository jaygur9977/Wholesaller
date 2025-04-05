import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const LoginSignup = () => {
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' or 'login'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [role, setRole] = useState(null);
  const [isVendorOrWholesalerModalOpen, setIsVendorOrWholesalerModalOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [shopPhoto, setShopPhoto] = useState(null);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI states
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleSignupClick = () => {
    setActiveTab('signup');
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    setActiveTab('login');
    setShowAuthModal(true);
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setIsVendorOrWholesalerModalOpen(true);
    setShowAuthModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopPhoto(file);
      setSelectedFileName(file.name);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('fullName', fullName);
    formData.append('basePrice', basePrice);
    formData.append('shopName', shopName);
    formData.append('category', category);
    if (shopPhoto) formData.append('shopPhoto', shopPhoto);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('pincode', pincode);
    formData.append('address', address);

    try {
      await axios.post('https://wholesaller.onrender.com/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      alert('Registration successful!');
      setIsVendorOrWholesalerModalOpen(false);
      setErrorMessage('');
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
      setShopName('');
      setCategory('');
      setShopPhoto(null);
      setState('');
      setCity('');
      setBasePrice('');
      setPincode('');
      setAddress('');
      setSelectedFileName('');
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Error during registration. Please try again!');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('https://wholesaller.onrender.com/api/users/login', {
        email,
        password,
        rememberMe
      });
      
      alert('Login successful!');
      setShowAuthModal(false);
      setErrorMessage('');
      // Handle successful login (store token, redirect, etc.)
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };


      
        const handleLoginRedirect = () => {
          setIsLoading(true);
          window.location.href = '/';
          window.location.pathname = '/';
        };

  // Custom modal styles
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      width: '400px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: 'none'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)'
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Wholesaller</h2>
            <p className="text-gray-600 mb-6">Connect with vendors and wholesalers in your area</p>
            

            <button
          className="inline-flex items-center mb-3 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleLoginRedirect}
          disabled={isLoading}
          >
         {isLoading ? 'Redirecting...' : 'back'}

        </button>


            <div className="flex flex-col space-y-4">
              <button
                onClick={handleSignupClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Create Account
              </button>
              <button
                onClick={handleLoginClick}
                className="border border-indigo-600 text-indigo-600 font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 hover:bg-indigo-50"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onRequestClose={() => setShowAuthModal(false)}
        style={customStyles}
        contentLabel="Authentication"
      >
        <div className="p-4">
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'signup' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
          </div>

          {activeTab === 'signup' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">Join as</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleRoleSelection('vendor')}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-3 px-4 rounded-lg transition duration-200 flex flex-col items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Vendor
                </button>
                <button
                  onClick={() => handleRoleSelection('wholesaler')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded-lg transition duration-200 flex flex-col items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Wholesaler
                </button>
              </div>
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{' '}
                <button onClick={() => setActiveTab('login')} className="text-indigo-600 hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
              {errorMessage && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                  {errorMessage}
                </div>
              )}
              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{' '}
                <button onClick={() => setActiveTab('signup')} className="text-indigo-600 hover:underline">
                  Sign up
                </button>
              </p>
            </form>
          )}
        </div>
      </Modal>

      {/* Registration Modal */}
      <Modal
        isOpen={isVendorOrWholesalerModalOpen}
        onRequestClose={() => setIsVendorOrWholesalerModalOpen(false)}
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
        contentLabel="Registration Form"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {role === 'vendor' ? 'Vendor Registration' : 'Wholesaler Registration'}
            </h2>
            <button 
              onClick={() => setIsVendorOrWholesalerModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-4">
              {/* Shop Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Photo</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer">
                    <span className="inline-block bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition duration-300">
                      Choose File
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <span className="ml-2 text-sm text-gray-500 truncate max-w-xs">
                    {selectedFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Email and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <input
                    type="text"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Shop Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  <option value="plastics">Plastics</option>
                  <option value="toys">Toys</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="hardware">Hardware</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : 'Register'}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LoginSignup;