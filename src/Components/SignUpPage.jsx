import React, { useEffect, useState } from "react";
import { LuEye, LuEyeClosed, LuImagePlus } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { userRegistration } from "../app/slices/authSlices";
import { useDispatch, useSelector } from "react-redux";

function SignUpPage() {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const regData = new FormData();
    regData.append("name", signUpData.name);
    regData.append("email", signUpData.name);
    regData.append("password", signUpData.name);
    regData.append("avatar", image);

    dispatch(userRegistration(regData));
    if (isAuth) {
      setSignUpData({
        name: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="font-inter overflow-hidden relative flex justify-center h-screen">
      <img
        src="/bg.png"
        alt="gradient background"
        className="w-full h-full object-cover fixed"
      />
      <div className="mx-auto max-w-lg px-6 lg:px-8 absolute py-20">
        <div className="rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSignUpSubmit} className="lg:p-11 p-7 mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-gray-900 font-manrope text-3xl font-bold leading-10 mb-2">
                Create an Account
              </h1>
            </div>
            {isError && <p className="text-red-500 text-center">{error}</p>}
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover mb-2 border border-gray-300"
                />
              ) : (
                <>
                  <label className="cursor-pointer flex flex-col items-center bg-gray-200 text-gray-700 px-4 py-4 rounded-full font-semibold">
                    <LuImagePlus fontSize={60} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-[9px] text-red-600">
                    *image shold not larger that 5MB
                  </p>
                </>
              )}
              {/* <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-4 rounded-full font-semibold">
                <LuImagePlus fontSize={60} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              Upload Profile Picture */}
            </div>

            {/* Name Input */}
            <input
              type="text"
              name="name"
              className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-indigo-700 px-4 mb-6"
              placeholder="Name"
              value={signUpData.name}
              onChange={handleSignUpChange}
              required
            />

            {/* Email Input */}
            <input
              type="email"
              name="email"
              className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-indigo-700 px-4 mb-6"
              placeholder="Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              required
            />

            {/* Password Input */}
            <div className="relative mb-6">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                className="w-full h-12 text-gray-900 placeholder-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-indigo-700 px-4 pr-12"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPass ? <LuEye /> : <LuEyeClosed />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full outline-none border-none bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 shadow-sm mb-6"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <div className="flex justify-center text-gray-900 text-base font-medium leading-6">
              Already have an account?
              <NavLink
                to="/login"
                className="text-indigo-600 font-semibold pl-3"
              >
                Login
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
