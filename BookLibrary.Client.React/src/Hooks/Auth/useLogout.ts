import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../useApi";
import useFetch from "../useFetch";
import { useApp } from "../useApp";

const useLogout = () => {
  const { data, error, fetchData } = useFetch();
  const [logoutErr, setLogoutErr] = useState("")
  const { clearAuthToken } = useApi();
  const {setCurrentRole} = useApp()
  const navigate = useNavigate();


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
        localStorage.removeItem("currentRole");
        clearAuthToken();
        setCurrentRole(undefined);
        navigate("/");
      }
  
      if (error) {
        setLogoutErr("Error logging out")      
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, navigate])

  return {
    handlerLogout,
    logoutErr
  }
}
export default useLogout