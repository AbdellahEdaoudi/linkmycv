"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../../context/MyContext";
import { Eye, EyeOff, Loader2 } from "../../components/lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [form, setForm] = useState({ username: "", fullname: "", password: "", confirm: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fromLink = new URLSearchParams(window.location.search).get("username");
    if (fromLink) {
      const clean = fromLink.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase().slice(0, 30);
      if (clean) setForm((prev) => ({ ...prev, username: clean }));
    }
  }, []);

  const handleUsernameKeyDown = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Enter",
      ].includes(e.key)
    ) {
      return;
    }
    if (!/^[a-zA-Z0-9._-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      // Remove any character that is not letters, numbers, dot, dash, or underscore
      value = value.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
    }
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, fullname, password, confirm } = form;

    if (!username || !fullname || !password || !confirm) {
      return setErrorMessage("All fields are required.");
    }
    if (password !== confirm) {
      return setErrorMessage("Passwords do not match.");
    }
    if (password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters.");
    }

    try {
      setIsLoading(true);
      await axios.post(`${SERVER_URL}/api/auth/register`, {
        username: username.toLowerCase().trim(),
        fullname,
        password,
      });
      router.push("/auth/login");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-purple-100 via-purple-50 to-sky-100 flex items-center justify-center p-6">

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl p-8 sm:p-10 bg-white rounded-3xl shadow-2xl transform transition duration-500 hover:scale-[1.01]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-purple-500 shadow-lg flex items-center justify-center p-2">
            <img
              src="/mycvlink-logo.png"
              className="w-14 h-14 object-contain"
              alt="linkmycv Logo"
            />
          </div>
        </div>

        <div className="space-y-4">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm font-medium text-center">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                maxLength={50}
                value={form.fullname}
                onChange={handleChange}
                placeholder="Yassine Bennani"
                required
                className="w-full p-3 border bg-white text-gray-800 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                maxLength={30}
                value={form.username}
                onKeyDown={handleUsernameKeyDown}
                onChange={handleChange}
                placeholder="yassine_bennani"
                required
                className="w-full p-3 border bg-white text-gray-800 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={60}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 pr-11 border bg-white text-gray-800 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={60}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 pr-11 border bg-white text-gray-800 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 mt-2 text-base flex items-center justify-center gap-2 ${isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <p className="text-center text-gray-600 text-sm mt-3">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
