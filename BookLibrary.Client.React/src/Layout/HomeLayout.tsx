import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import SideBar from "../components/SideBar"

const HomeLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleShowSideBar = () => {
    setIsOpen(!isOpen)
  }

  const handleNavigate = (path: string): void => {
    navigate(`./${path}`)
  }


  return (
    <div className="flex flex-col max-h-[100vh] overflow-hidden">
        <Header setShowSideBar={handleShowSideBar} showSideBar={isOpen} />
      <div className="flex">
        <SideBar onNavigate={handleNavigate} showSideBar={isOpen} />
        <div className="flex-1  md:ml-[18rem] mx-auto h-[calc(100vh-95px)] px-4 overflow-y-auto">

           <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default HomeLayout