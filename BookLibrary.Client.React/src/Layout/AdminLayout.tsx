import { useState } from "react"
import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import RightSideBar from "../components/RightSideBar"
import SideBar from "../components/SideBar"
import { useApi } from "../Hooks/useApi"
import AccessDenied from "../components/AccessDenied"

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showRightSideBar, setShowRightSideBar] = useState(false)
  const { userRoles } = useApi()

  const isAdmin = userRoles?.includes("Admin")

  if (!isAdmin) {
    return (
      <AccessDenied />
    )
  }

  const handleShowSideBar = () => {
    setIsOpen(!isOpen)
  }

  const handleShowRightSideBar = () => {
    setShowRightSideBar(!showRightSideBar)
  }

  return (
    <div className="flex flex-col max-h-[100vh] overflow-hidden z-[999]">
        <Header setShowSideBar={handleShowSideBar} showSideBar={isOpen} setShowRightSideBar={handleShowRightSideBar} showRightSideBar={showRightSideBar} />
      <div className="flex relative">
        <SideBar showSideBar={isOpen} />
        <RightSideBar showRightSideBar={showRightSideBar} />
        <div className="flex-1  md:ml-[18rem] mx-auto h-[calc(100vh-120px)] px-4 overflow-y-auto">
          { <Outlet />}
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default AdminLayout