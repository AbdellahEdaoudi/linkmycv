"use client";
import React, { useContext, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../../context/MyContext";
import { Eye, EyeOff, Loader2 } from "../../components/lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setData } = useContext(MyContext);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameKeyDown = (e) => {
    // Allow control keys: Backspace, Delete, Tab, Arrow keys, Enter, Ctrl/Cmd shortcuts
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
    // Block any key not matching allowed characters: a-z, A-Z, 0-9, ., _, -
    if (!/^[a-zA-Z0-9._-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      value = value.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
    }
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
    setErrorMessage("");
  };

  const Login = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      return setErrorMessage("All fields are required.");
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      setData(res.data);
      if (typeof window !== "undefined") {
        const uName = res.data?.user?.username;
        if (uName) {
          localStorage.setItem("username", uName);
          localStorage.setItem(`data_${uName}`, JSON.stringify(res.data));
        }
        window.dispatchEvent(new Event("auth-change"));
      }
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-gradient-to-br from-purple-100 via-purple-50 to-sky-100 flex items-center justify-center p-6">

      <form
        onSubmit={Login}
        className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform transition duration-500 hover:scale-105"
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
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded relative text-sm"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span>{errorMessage}</span>
            </div>
          )}

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
              className="w-full p-3 border bg-white text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                maxLength={60}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full p-3 pr-11 border bg-white text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading
                ? "opacity-75 cursor-not-allowed"
                : ""
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={19} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <p className="text-center text-gray-600 text-sm mt-3">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-bold">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
