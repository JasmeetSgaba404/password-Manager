import { useState } from "react";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import { setKey, setUser } from "../Store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);

  const [signUp, setSignUp] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const loginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const signUpChange = (e) => {
    const { name, value } = e.target;
    setSignUp((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const clientHash = CryptoJS.SHA256(login.password).toString();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials : "include",
        body: JSON.stringify({ email: login.email, password: clientHash }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome back!");
        dispatch(setKey(clientHash));
        dispatch(setUser(data.user))
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Server connection lost");
      console.log(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUp.password !== signUp.confirmPass) {
      return toast.error("Passwords do not match"); // Added 'return' to stop execution
    }

    try {
      const hashedKey = CryptoJS.SHA256(signUp.password).toString();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signUp.username,
          email: signUp.email,
          password: hashedKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created! Please log in.");
        setIsLogin(true);
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("Network Error: Could not connect to server");
       console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Toggle Header */}
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  name="username"
                  value={signUp.username}
                  onChange={signUpChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="johndoe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={isLogin ? login.email : signUp.email}
                onChange={isLogin ? loginChange : signUpChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={isLogin ? login.password : signUp.password}
                onChange={isLogin ? loginChange : signUpChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPass"
                  value={signUp.confirmPass}
                  onChange={signUpChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20 mt-4"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
            >
              {isLogin ? "Create one" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;