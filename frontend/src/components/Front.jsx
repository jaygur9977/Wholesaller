import { MagnifyingGlassIcon, MapPinIcon, ChartBarIcon, ScaleIcon, ArrowPathIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
export default function Front() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRedirect = () => {
    setIsLoading(true);
    window.location.href = '/search';
    window.location.pathname = '/search';
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">

      <div className="relative h-screen/2 min-h-[400px] overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="data:image/jpeg;base64,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"
      alt="Fresh fruits and vegetables"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"></div>
  </div>
 
     

<div className="relative max-w-7xl mx-auto h-full flex items-centerpy-16 px-4  sm:px-6 lg:px-8">
    <div className="text-center w-full">
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Connect Vendors with Local Wholesalers
      </h1>
      <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-100">
        Find the best wholesale deals in your area or list your wholesale business to grow your customer base.
      </p>
      <div className="mt-10 flex justify-center space-x-4">
      

          <button
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleLoginRedirect}
          disabled={isLoading}
          >
         {isLoading ? 'Redirecting...' : 'search wholesaler'}

        </button>
       

      </div>
    </div>
  </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to connect vendors and wholesalers
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 - Search Nearby */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <div
                 className="mt-4"
                onClick={handleLoginRedirect}
                disabled={isLoading}
                >    
                  <h3 className="text-lg font-medium text-gray-900">Search by Location</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Vendors can find wholesalers nearby by state or city to reduce shipping costs and time.
                  </p>
                </div>
              </div>

              {/* Feature 2 - Compare */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ScaleIcon className="h-6 w-6" />
                </div>
                <div 
                // onClick={}
                className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Compare Wholesalers</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Side-by-side comparison of multiple wholesalers to make informed purchasing decisions.
                  </p>
                </div>
              </div>

              {/* Feature 3 - Quotations */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ArrowPathIcon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Request Quotations</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get quotes from multiple wholesalers at once to negotiate the best deals.
                  </p>
                </div>
              </div>

              {/* Feature 4 - Analytics */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Reduce Losses</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Comprehensive comparison tools help vendors minimize losses by finding optimal suppliers.
                  </p>
                </div>
              </div>

              {/* Feature 5 - Growth */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Business Growth</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Wholesalers can list their shops to increase visibility and attract more vendor customers.
                  </p>
                </div>
              </div>

              {/* Feature 6 - Easy Management */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ShoppingCartIcon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tools for wholesalers to manage inventory and for vendors to track orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your local business to global?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join hundreds of vendors and wholesalers already growing their businesses with our platform.
          </p>
          <a
            href="#"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 WholeVend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

