import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MarketingPlan from "./pages/MarketingPlan";
import PlatformLaunch from "./pages/PlatformLaunch";
import RoadMap from "./pages/RoadMap";
import MainLayout from "./Layout/MainLayout";
import React, { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout darkMode={darkMode} toggleTheme={toggleTheme} />,
      children: [
        { index: true, element: <MarketingPlan /> },
        { path: "marketing", element: <MarketingPlan /> },
        { path: "platform", element: <PlatformLaunch /> },
        { path: "roadmap", element: <RoadMap /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
