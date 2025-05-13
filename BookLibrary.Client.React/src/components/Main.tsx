import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <main role="main" className="block w-full h-[calc(100vh-120px)] px-4">
        <Outlet />
    </main>
  )
}

export default Main;