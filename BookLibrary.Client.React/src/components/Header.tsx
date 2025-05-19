import { useEffect, useState } from "react";
import { FiMenu, FiSettings, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useApi } from "../Hooks/useApi";
import { useApp } from "../Hooks/useApp";
import useLogout from "../Hooks/Auth/useLogout";

type Props = {
  setShowSideBar: () => void;
  showSideBar: boolean;
  setShowRightSideBar: () => void;
  showRightSideBar: boolean;
}

const Header = ({ setShowSideBar, showSideBar, setShowRightSideBar, showRightSideBar }: Props) => {
  const [logined, setLogined] = useState(false);
  const { currentRole } = useApp()
  const { appUser } = useApi()
  const location = useLocation();

  const {handlerLogout, logoutErr} = useLogout()
  
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
      <header className="bg-white border-b border-gray-200 fixed w-screen h-[60px] top-0">
        <nav className=" md:w-[96%] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="mr-4 lg:hidden focus:outline-none" 
                onClick={() => setShowSideBar && setShowSideBar()}
                aria-label="Toggle sidebar"
              >
                {showSideBar ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
              <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                Book Library { currentRole == "Admin" && <span>({currentRole})</span> }
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {logined && appUser && (
                <div className="relative flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="hidden md:block text-gray-600">Welcome, {appUser}</span>
                    <button
                      onClick={handlerLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                  <button
                    className="focus:outline-none"
                    onClick={() => setShowRightSideBar()}
                    aria-label="Toggle settings"
                  >
                    {showRightSideBar ? (
                      <FiX className="w-6 h-6" />
                    ) : (
                      <FiSettings className="w-6 h-6" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        {logoutErr && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
            <span className="block sm:inline">{logoutErr}</span>
          </div>
        )}
      </header>
      <div className="h-16"></div> {/* Spacer for fixed header */}
    </>
  )
}

export default Header