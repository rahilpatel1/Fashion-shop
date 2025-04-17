import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="mt-6 bg-black text-white px-6 py-3 rounded">
        Go to Home
      </Link>
    </div>
  );
}
