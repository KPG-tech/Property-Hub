import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('role');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
      <header className="bg-gray-200 shadow-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="p-1.5">
              <span className="sr-only">Property Listings</span>
              <img
                  className="h-8 w-auto filter grayscale"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=gray&shade=600"
                  alt="Logo"
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8 items-center">
            <Link to="/" className="text-sm font-semibold text-gray-800 hover:text-gray-600">
              Home
            </Link>
            {isLoggedIn && userRole === 'user' && (
                <Link to="/my-bookings" className="text-sm font-semibold text-gray-800 hover:text-gray-600">
                  My Bookings
                </Link>
            )}
            {!isLoggedIn ? (
                <>
                  <Link to="/login" className="text-sm font-semibold text-gray-800 hover:text-gray-600">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-semibold text-gray-800 hover:text-gray-600">
                    Signup
                  </Link>
                </>
            ) : (
                <>
                  <Link to="/profile" className="text-sm font-semibold text-gray-800 hover:text-gray-600">
                    Profile
                  </Link>
                  <button
                      onClick={handleLogout}
                      className="text-sm font-semibold text-gray-800 hover:text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Logout
                  </button>
                </>
            )}
          </div>
        </nav>
        {/* Mobile menu */}
        <div
            className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            role="dialog"
            aria-modal="true"
        >
          <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-3/4 max-w-sm overflow-y-auto bg-gray-100 px-6 py-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link to="/" className="p-1.5">
                <span className="sr-only">Property Listings</span>
                <img
                    className="h-8 w-auto filter grayscale"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=gray&shade=600"
                    alt="Logo"
                />
              </Link>
              <button
                  type="button"
                  className="rounded-md p-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6">
              <div className="space-y-2">
                <Link
                    to="/"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                >
                  Home
                </Link>
                {isLoggedIn && userRole === 'user' && (
                    <Link
                        to="/my-bookings"
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                    >
                      My Bookings
                    </Link>
                )}
                {!isLoggedIn ? (
                    <>
                      <Link
                          to="/login"
                          className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                      >
                        Login
                      </Link>
                      <Link
                          to="/register"
                          className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                      >
                        Signup
                      </Link>
                    </>
                ) : (
                    <>
                      <Link
                          to="/profile"
                          className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;