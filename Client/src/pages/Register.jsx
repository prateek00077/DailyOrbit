import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register with:", { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
