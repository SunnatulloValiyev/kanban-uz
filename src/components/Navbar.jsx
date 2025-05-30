import React from "react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

    const [darkMode, setDarkMode] = useState(false)

useEffect(() => {
    if (darkMode) {
        document.documentElement.dataset.theme = "light";
    } else {
        document.documentElement.dataset.theme = "dark";
    }
}, [darkMode]);


  return (
    <div className="bg-[#ffffff] ">
      <div className="pl-8 pt-10">
        <img src="../svg/Group 16.svg" alt="kanban" />
      </div>
      <nav className="flex flex-col w-[300px] h-[820px] gap-8 p-4 pl-8 pt-16">
        <p className="font-semibold">ALL BOARDS (3)</p>
        <NavLink
          to="/marketing"
          className="page no-underline flex gap-3 text-black hover:text-black focus:outline-none"
        >
          <img
            src="./svg/fluent_board-split-24-regular.svg"
            alt="fluent"
            width={16}
            height={16}
          />
          Marketing Plan
        </NavLink>
        <NavLink
          to="/platform"
          className="page no-underline flex gap-3 text-black hover:text-black focus:outline-none"
        >
          <img
            src="./svg/fluent_board-split-24-regular.svg"
            alt="fluent"
            width={16}
            height={16}
          />
          Platform Launch
        </NavLink>
        <NavLink
          to="/roadmap"
          className="page no-underline flex gap-3 text-black hover:text-black focus:outline-none"
        >
          <img
            src="./svg/fluent_board-split-24-regular.svg"
            alt="fluent"
            width={16}
            height={16}
          />
          Road Map
        </NavLink>
      </nav>

      <div className="flex justify-around items-center bg-[#cfdefe] w-[251px] h-[48px] ml-8 mb-8 rounded-sm">
        <img src="./svg/Combined Shape.svg" alt="combined" width={18} height={18}/>
        <input
          type="checkbox"
          value="synthwave"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="toggle theme-controller col-span-2 col-start-1 row-start-1 border-sky-400 bg-amber-300 [--tglbg:var(--color-sky-500)] checked:border-blue-800 checked:bg-blue-300 checked:[--tglbg:var(--color-blue-900)]"
        />
        <img src="./svg/Combined Shape(1).svg" alt="combined" width={18} height={18}/>
      </div>
    </div>
  );
}

export default Navbar;
