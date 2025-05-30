import React from "react"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div>
      <div className="flex bg-[#E4EBFA]">
          <Navbar />
        <div className="flex-1 bg-gray-100">
            <div className="h-[97px] bg-[#ffffff]">
                <Outlet />
            </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout