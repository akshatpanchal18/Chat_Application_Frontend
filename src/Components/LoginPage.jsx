import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../app/slices/authSlices";
import { NavLink, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { isLoading, isError, error, isAuth } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);
  // console.log("data", isAuth);
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin(loginData));
    // if (isAuth) {
    //   navigate("/");
    // }
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
          <form className="lg:p-11 p-7 mx-auto" onSubmit={handleLoginSubmit}>
            <div className="mb-11 text-center">
              <h1 className="text-gray-900 font-manrope text-3xl font-bold leading-10 mb-2">
                Welcome Back
              </h1>
              {isError && <p className="text-red-500">{error}</p>}
            </div>
            <input
              type="text"
              name="email"
              className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-black px-4 mb-2"
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
            {/* <div className="flex justify-end mb-6"></div> */}
            <button
              type="submit"
              className="w-full h-12 mt-10 text-white text-base font-semibold leading-6 rounded-full outline-none border-none bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 shadow-sm mb-2"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
            <div className="flex justify-center text-gray-900 text-base font-medium leading-6">
              Don’t have an account?
              <NavLink
                to="/sign-up"
                className="text-indigo-600 font-semibold pl-3"
              >
                Sign Up
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
