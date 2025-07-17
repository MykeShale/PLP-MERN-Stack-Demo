import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { API_BASE_URL } from "../../config/config";
import toast from "react-hot-toast"
import { useLoadingStore } from "../../store/loading.store";

export default function Signup() {
  const { loading, setLoading}=useLoadingStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
        setLoading(true)
        e.preventDefault();
        console.log("Signup Data:", formData);
        const res = await fetch(`${API_BASE_URL}/auth/v1/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log(data);
        
        if (res.ok) {
            toast.success("Account created successfully 🎉");
            console.log(data);
            navigate("/signin")
        } else {
            toast.error(data.message || "Signup failed");
        }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">
          Create an Account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Join FlowForge and streamline your workflow
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

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
             {loading ? "Signing you up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-4 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
