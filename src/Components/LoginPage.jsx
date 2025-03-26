import React, { useState } from "react";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login request
    setTimeout(() => {
      console.log("Logging in with:", loginData);
      setLoading(false);
      setLoginData({
        email: "",
        password: "",
      });
    }, 2000);
  };
  return (
    <div className="font-inter overflow-hidden relative flex justify-center h-screen">
      <img
        src="/bg.png"
        // src="https://pagedone.io/asset/uploads/1702362010.png"
        alt="gradient background"
        className="w-full h-full object-cover fixed"
      />
      <div className="mx-auto max-w-lg px-6 lg:px-8 absolute py-20">
        <div className="rounded-2xl bg-white shadow-xl">
          <form className="lg:p-11 p-7 mx-auto">
            <div className="mb-11 text-center">
              <h1 className="text-gray-900 font-manrope text-3xl font-bold leading-10 mb-2">
                Welcome Back
              </h1>
            </div>
            <input
              type="text"
              name="email"
              className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-black px-4 mb-6"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-black px-4 mb-1"
              placeholder="Password"
              required
            />
            <div className="flex justify-end mb-6">
              {/* <a
                href="#"
                className="text-indigo-600 text-base font-normal leading-6"
              >
                Forgot Password?
              </a> */}
            </div>
            <button
              type="submit"
              className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 shadow-sm mb-11"
              onClick={handleLoginSubmit}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <div className="flex justify-center text-gray-900 text-base font-medium leading-6">
              Don’t have an account?
              <a href="#" className="text-indigo-600 font-semibold pl-3">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
