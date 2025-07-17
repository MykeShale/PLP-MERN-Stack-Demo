import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useLoadingStore } from "../../store/loading.store";
import useLoginStore from "../../store/login.store";
import useMemberStore from "../../store/member.store";
import toast from "react-hot-toast"
import { API_BASE_URL } from "../../config/config";

export default function Signin() {
  const {loading, setLoading}=useLoadingStore()
  const {login, setLogin}=useLoginStore()
  const navigate=useNavigate()
  const {member, changeMemberInformation}=useMemberStore()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    try {
        setLoading(true)
        e.preventDefault();
        console.log("Signin Data:", formData);
        const res = await fetch(`${API_BASE_URL}/auth/v1/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log(data);
        
        if (res.ok) {
            toast.success("Logged in successfully 🎉");
            setLogin(true)
            console.log(data);
            changeMemberInformation(data)
            navigate("/tasks")
        } else {
            toast.error(data.message || "Signin failed");
        }
    } catch (error) {
        console.log(error)
      toast.error("Network error. Try again.");
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Sign in to continue with FlowForge
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <Button type="submit" className="w-full bg-white text-black p-2 cursor-pointer rounded-md" disabled={loading}>
                {loading ? "Signing you in..." : "Sign In"}
            </Button>
        </form>

        <p className="text-center mt-4 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
