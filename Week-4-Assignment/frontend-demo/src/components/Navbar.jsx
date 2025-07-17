import React from 'react';
import { Link } from "react-router-dom";
import { navLinks } from '../utils/NavbarLinks';
import { FaMoon, FaSun } from 'react-icons/fa';
import useLoginStore from '../../store/login.store';
import useMemberStore from '../../store/member.store';
import toast from "react-hot-toast"

export default function Navbar({ toggleTheme, theme }) {
  const {login, setLogin}=useLoginStore()
  const member=useMemberStore((state)=>state.member)
  const clearMemberInformation=useMemberStore((state)=>state.clearMemberInformation)
  const handleLogout=async()=>{
    try {
      //clear stores
      setLogin(false);
      clearMemberInformation();

      // show success toast
      toast.success("Logged out successfully ✅");

      // redirect to signin page
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to logout");
    }
  }
  return (
    <nav className="bg-blue-600 text-white px-10 md:px-20 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="font-bold text-2xl">FlowForge</div>

      {/* Links */}
      <div className="flex gap-6 items-center">
        {member && (
          <p>Welcome {member.user.name}</p>
        )}
        {navLinks.map((link) => (
          <Link key={link.id} to={link.href} className="hover:underline">
            {link.name}
          </Link>
        ))}

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="text-lg">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {
          login ? (
          <Link 
            to="" 
            className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={handleLogout}
          >
            Sign Out
          </Link>
          ) :(
          <Link 
            to="/signin" 
            className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Sign In
          </Link>

          )
        }
      </div>
    </nav>
  );
}
