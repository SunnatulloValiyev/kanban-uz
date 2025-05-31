import React from "react"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

function MainLayout({ darkMode, toggleTheme }) {
  return (
    <div className="min-h-screen w-full bg-base-200">
      <div className="flex">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="flex-1 bg-base-100">
          <div className="h-[97px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout