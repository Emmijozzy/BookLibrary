import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../Hooks/useApi";
import UseFetch from "../Hooks/UseFetch";

type Props = {
  setShowSideBar?: () => void;
  showSideBar?: boolean;
}

const Header = ({ setShowSideBar, showSideBar }: Props) => {
  const [logined, setLogined] = useState(false);
  const [logoutErr, setLogoutErr] = useState("")
  const { data, error, fetchData } = UseFetch();

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

    console.log(error)
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
    console.log(path);
  }, [location]);
 



  return (
    <>
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-4 lg:hidden" onClick={setShowSideBar}>
              {showSideBar ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>            <Link to="/" className="text-2xl font-bold text-gray-800">Book Library</Link>
          </div>
          <div className="flex items-center gap-4">
            {logined && appUser && <span className="text-gray-600">Welcome, {appUser}</span>}
            {logined && <button className="nav-link text-gray-600 hover:text-gray-800" onClick={handlerLogout}>Logout</button>}
          </div>       
        </nav>
      </header>
      <p className="bg-red-500 text-gray-800 rounded-sm px-2 w-full" >{logoutErr}</p>    </>
  )
}
export default Header