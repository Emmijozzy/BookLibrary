import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import useLogout from "../Hooks/Auth/useLogout";
import { useApi } from "../Hooks/useApi";
import { useApp } from "../Hooks/useApp";


type Props = {
  setShowSideBar: () => void;
  showSideBar: boolean;
}

const Header = ({ setShowSideBar, showSideBar }: Props) => {
  const [logined, setLogined] = useState(false);
  const { currentRole, setCurrentRole } = useApp()
  const { appUser, userRoles } = useApi()
  const location = useLocation();
  
  const { logoutErr} = useLogout()

  const multipleRoles = Array.isArray(userRoles) && userRoles?.length > 1;
  
  useEffect(() => {
    const path = location.pathname;
    if (!path.includes("Auth")) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  }, [location]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed w-full h-[60px] top-0 z-50 shadow-sm">
        <nav className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <button 
                className="mr-4 lg:hidden hover:bg-gray-100 p-2 rounded-md transition-colors"
                onClick={() => setShowSideBar()}
                aria-label="Toggle sidebar"
              >
                {showSideBar ? (
                  <FiX className="w-5 h-5 text-gray-600" />
                ) : (
                  <FiMenu className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors flex items-center">
                Book Library {currentRole === "Admin" && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">({currentRole})</span>}
              </Link>
            </div>

            <div className="flex items-center">
              {logined && appUser && multipleRoles && (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">User</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={currentRole === "Admin"}
                        onChange={() => setCurrentRole(currentRole === "Admin" ? "User" : "Admin")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm text-gray-600 font-medium">Admin</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        {logoutErr && (
          <div className="absolute top-[60px] left-0 right-0 bg-red-100 border-b border-red-400 text-red-700 px-4 py-2 text-center" role="alert">
            <span className="font-medium">{logoutErr}</span>
          </div>
        )}
      </header>
      <div className="h-16"></div>
    </>
  )
}

export default Header