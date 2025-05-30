import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MarketingPlan from "./pages/MarketingPlan"
import PlatformLaunch from "./pages/PlatformLaunch"
import RoadMap from "./pages/RoadMap"
import MainLayout from "./Layout/MainLayout"
import React from "react"


function App() {
  const router = createBrowserRouter ([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        { path: "marketing", element: <MarketingPlan /> },
        { path: "platform", element: <PlatformLaunch /> },
        { path: "roadmap", element: <RoadMap /> },
      ],
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
