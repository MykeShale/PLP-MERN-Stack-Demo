import React from 'react'
import { Link } from "react-router-dom";
import { navLinks } from '../utils/NavbarLinks';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar({ toggleTheme , theme}) {
  return (
    <nav className="bg-blue-600 text-white px-10 md:px-20 py-4 flex justify-between items-center">
      <div className="font-bold text-2xl">FlowForge</div>
      <div className="flex gap-6">
        {navLinks.map((link)=>(
          <Link key={link.id} to={link.href}>{link.name}</Link>
        ))}
        <button onClick={toggleTheme}>{theme=='light' ? <FaMoon/> : <FaSun/>}</button>
      </div>
    </nav>
  );
}
