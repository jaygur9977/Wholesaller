
// import React, { useState } from 'react';
// import { ShoppingCartIcon } from '@heroicons/react/24/outline';


// const Navbar = ({ setShowAuthModal }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  

//   const handleLoginRedirect = () => {
//     setIsLoading(true);

//     window.location.href = '/login';

//     window.location.pathname = '/login';
//   };

  
//     const handlesearch = () => {
//       setIsLoading(true);
//       window.location.href = '/search';
//       window.location.pathname = '/search';
//     };


//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <nav className="bg-gray-800 text-white p-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div className="flex items-center">
//           <ShoppingCartIcon className="h-8 w-8 text-indigo-600" />
//           <span className="ml-2 text-xl font-bold text-white">WholeVend</span>
//         </div>

//         <div className="hidden md:flex items-center space-x-4">


        


//           <button
//           onClick={handlesearch}
//           disabled={isLoading}
//            className="bg-transparent text-2xl hover:text-gray-400">🔍</button>
//           <button className="bg-transparent border-2 border-white py-2 px-4 rounded hover:bg-white hover:text-gray-800 transition">
//             History
//           </button>


//           <button
//             onClick={handleLoginRedirect}
//             disabled={isLoading}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '16px'
//             }}
//           >
//             {isLoading ? 'Redirecting...' : 'Go to Login'}
//           </button>
//         </div>

//         {/* Hamburger menu for mobile */}
//         <div className="md:hidden flex items-center">
//           <button onClick={toggleMenu} className="text-3xl text-white">
//             ☰
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu - Slide in from the right */}
//       <div
//         className={`fixed inset-0 bg-gray-700 bg-opacity-75 md:hidden transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           } transition-transform duration-300 ease-in-out`}
//       >
//         <div className="flex justify-end p-4">
//           <button onClick={toggleMenu} className="text-3xl text-white">
//             ✖️
//           </button>
//         </div>
//         <div className="flex flex-col items-center space-y-4 py-8">
//           <button className="bg-transparent text-2xl hover:text-gray-400">🔔 Notifications</button>
//           <button className="bg-transparent text-2xl hover:text-gray-400">🔍 Search</button>
//           <button className="bg-transparent border-2 border-white py-2 px-4 rounded hover:bg-white hover:text-gray-800 transition">
//             History
//           </button>

//           <button
//             onClick={handleLoginRedirect}
//             disabled={isLoading}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '16px'
//             }}
//           >
//             {isLoading ? 'Redirecting...' : 'Go to Login'}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

// Mock database in localStorage
const LOCAL_STORAGE_KEY = 'wholevend_users';

const initializeLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  }
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
};

const createUser = (userData) => {
  const users = getUsers();
  users.push(userData);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  return userData;
};

const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const updateUser = (email, updatedData) => {
  const users = getUsers();
  const index = users.findIndex(user => user.email === email);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  }
  return null;
};

const deleteUser = (email) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.email !== email);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredUsers));
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });


  
    const handleLoginRedirect = () => {
      setIsLoading(true);
      window.location.href = '/login';
      window.location.pathname = '/login';
    };



  // Initialize localStorage on component mount
  useEffect(() => {
    initializeLocalStorage();
    // Check if user is already logged in
    const loggedInUser = JSON.parse(localStorage.getItem('wholevend_current_user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = () => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(formData.email);
      if (existingUser) {
        alert('User with this email already exists');
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // Note: In a real app, never store plain passwords
        createdAt: new Date().toISOString()
      };

      createUser(newUser);
      
      // Log the user in
      localStorage.setItem('wholevend_current_user', JSON.stringify(newUser));
      setUser(newUser);
      setShowAuthModal(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error signing up: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    try {
      const foundUser = getUserByEmail(formData.email);
      
      if (!foundUser) {
        alert('User not found');
        return;
      }

      if (foundUser.password !== formData.password) {
        alert('Incorrect password');
        return;
      }

      // Log the user in
      localStorage.setItem('wholevend_current_user', JSON.stringify(foundUser));
      setUser(foundUser);
      setShowAuthModal(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error logging in: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('wholevend_current_user');
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-800 text-white p-4">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {authMode === 'signup' ? 'Sign Up' : 'Login'}
            </h2>
            
            {authMode === 'signup' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={authMode === 'signup' ? handleSignUp : handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                {isLoading ? 'Processing...' : authMode === 'signup' ? 'Sign Up' : 'Login'}
              </button>
              
              <button
                onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                className="w-full text-blue-600 hover:text-blue-800 py-2 px-4 rounded transition"
              >
                {authMode === 'signup' ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </button>
            </div>
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingCartIcon className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-white">WholeVend</span>
        </div>

        <div className="hidden md:flex items-center space-x-4">

        <button
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleLoginRedirect}
          disabled={isLoading}
          >
         {isLoading ? 'Redirecting...' : 'add vender'}

        </button>


        <button
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleLoginRedirect}
          disabled={isLoading}
          >
         {isLoading ? 'Redirecting...' : 'add wholesaler'}

        </button>


          <button
            onClick={() => window.location.href = '/search'}
            disabled={isLoading}
            className="bg-transparent text-2xl hover:text-gray-400"
          >
            🔍
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-3xl text-white">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide in from the right */}
      <div
        className={`fixed inset-0 bg-gray-700 bg-opacity-75 md:hidden transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-3xl text-white">
            ✖️
          </button>
        </div>
        <div className="flex flex-col items-center space-y-4 py-8">
          <button 
            onClick={() => window.location.href = '/search'}
            className="bg-transparent text-2xl hover:text-gray-400"
          >
            🔍 Search
          </button>
        

          {user ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white">{user.name}</span>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 w-full px-8">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                  toggleMenu();
                }}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                  toggleMenu();
                }}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;