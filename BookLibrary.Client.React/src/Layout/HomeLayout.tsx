import { useState } from "react"
import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const HomeLayout = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleShowSideBar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex flex-col max-h-[100vh] overflow-hidden z-[999]">
        <Header setShowSideBar={handleShowSideBar} showSideBar={isOpen} />
      <div className="flex relative">
        <SideBar showSideBar={isOpen} />
        <div className="flex-1  md:ml-[18rem] mx-auto h-[calc(100vh-120px)] px-2 py-4 overflow-y-auto">
           <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default HomeLayout