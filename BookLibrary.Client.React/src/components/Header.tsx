import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../Hooks/useApi";
import useFetch from "../Hooks/useFetch";

type Props = {
  setShowSideBar?: () => void;
  showSideBar?: boolean;
}

const Header = ({ setShowSideBar, showSideBar }: Props) => {
  const [logined, setLogined] = useState(false);
  const [logoutErr, setLogoutErr] = useState("")
  const { data, error, fetchData } = useFetch();

  const { appUser, clearAuthToken } = useApi()

  const navigate = useNavigate();
  const location = useLocation();

  const handlerLogout = () => {
    const authToken = localStorage.getItem("authToken") as string
    const values = {
      token: authToken
    }
    fetchData("AuthApi/logout", {method: 'post', data: {...values}});
  }

  useEffect(() => {
    if(data) {
      localStorage.removeItem("authToken");
      clearAuthToken();
      navigate("/");
    }

    if (error) {
      setLogoutErr("Error logging out")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, navigate])
  
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
      <header className="bg-white border-b border-gray-200 fixed w-full h-[60px] top-0 z-[999]">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="mr-4 lg:hidden focus:outline-none" 
                onClick={() => setShowSideBar && setShowSideBar()}
                aria-label="Toggle sidebar"
              >
                {showSideBar ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                Book Library
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {logined && appUser && (
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span className="hidden md:block text-gray-600">Welcome, {appUser}</span>
                    <button
                      onClick={handlerLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
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