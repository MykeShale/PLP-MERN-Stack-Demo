import React from 'react'
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl lg:text-6xl font-bold mb-4 text-white mt-10">Forge Your Perfect Workflow</h1>
      <p className="mb-6 text-gray-300 md:text-2xl">
        Transform chaos into clarity with FlowForge. Prioritize what matters most, and keep your team synchronized across every project with confidence.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Link to="/tasks">
          <Button>Go to Task Manager</Button>
        </Link>
        <Link to="/api">
          <Button variant="secondary">View API Data</Button>
        </Link>
      </div>
    </div>
  );
}
