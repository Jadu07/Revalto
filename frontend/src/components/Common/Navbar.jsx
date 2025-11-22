// import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RevaltoLogoIcon from "@/assets/RevaltoLogo";
import LocationIcon from "@/assets/LocationIcon";
import SearchIcon from "@/assets/SearchIcon";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  // const [userName, setUserName] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth(); // Get user from context
  const isLoggedIn = !!user; // Check if user exists
  const userName = user?.userName || user?.name || "";
  const userEmail = user?.email || "";
  const navigate = useNavigate();
  const location = useLocation();
  const isSellActive = location.pathname.startsWith("/sell") || location.pathname === "/add-product";

  // useEffect(() => {
  //   const checkUser = () => {
  //     const storedUser = localStorage.getItem("user");
  //     if (storedUser) {
  //       const user = JSON.parse(storedUser);
  //       setUserName(user.userName || user.name || "");
  //       setUserEmail(user.email || "");
  //       setIsLoggedIn(true);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkUser();
  // }, []);

  return (
    <div
  className={`w-full ${
    isSellActive
      ? 'bg-linear-to-r from-blue-100 to-blue-50 border-blue-20'
      : 'bg-white border-gray-200'
  }  sticky top-0 z-50`}
>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-between py-3 sm:py-4 w-full">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <RevaltoLogoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-900 shrink-0" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
              Revalto
            </span>
          </div>

          {/* Location Button - Hidden on mobile */}
          <button className="hidden md:inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 lg:px-4 py-2 sm:py-2.5 transition-colors shrink-0 whitespace-nowrap">
            <LocationIcon className="w-[18px] h-[18px] text-gray-600 shrink-0" />
            <span className="text-sm font-medium text-gray-700 hidden lg:inline">Location</span>
          </button>

          {/* Search Bar - Responsive */}
          <div className="flex-1 min-w-0 max-w-2xl mx-2 sm:mx-3 md:mx-4 hidden sm:block">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 text-gray-400">
                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 hover:bg-white focus:bg-white focus:border-gray-600 transition-colors py-2 sm:py-2.5 md:py-3 pl-9 sm:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <SearchIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
            {isLoggedIn ? (
              <UserDropdown userName={userName} userEmail={userEmail} />
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors shrink-0"
                onClick={() => navigate("/login")}
              >
                <img src="/user.png" alt="User" className="h-8 w-8 shrink-0" />
                <span className="text-sm font-medium text-gray-800 capitalize hidden md:block whitespace-nowrap">
                  Login
                </span>
              </div>
            )}
            <button className={`cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors shrink-0`}>
              <img src="/wishlist.png" alt="wishlist" className="h-8 w-8 shrink-0" />
            </button>
            <button
              className={`cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors shrink-0 ${isSellActive ? 'border-b-2 border-blue-600' : ''}`}
              onClick={() => navigate("/sell")}
              aria-current={isSellActive ? 'page' : undefined}
            >
              <img src="/loan.png" alt="Loan" className="h-8 w-8 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
