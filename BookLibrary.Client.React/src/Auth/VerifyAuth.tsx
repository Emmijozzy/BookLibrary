import { Navigate, Outlet } from "react-router-dom";
import { useApi } from "../Hooks/useApi";

const VerifyAuth = () => {
    console.log("Verifying User ...");
    const { isAuthenticated, isInitialized } = useApi();
    let content;

    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
        console.log("User is authenticated", "initializing");
        if (!isInitialized) {
            content = <p>Loading...</p>
        } else {
            content = <Outlet />
        }
    } else {
        content = <Navigate to="/Auth/Login" />
    }

    return content
}
export default VerifyAuth