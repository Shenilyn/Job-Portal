import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "firebase/auth";
import { app } from "./firebase";

const Signup = () => {
    const navigate = useNavigate();
    const auth = getAuth(app); // Get Firebase Auth instance
    const googleProvider = new GoogleAuthProvider();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleClose = () => {
        navigate("/"); // Redirect to home page
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\s/.test(email)) {
            alert("Please enter a valid email address without spaces.");
            return;
        } else if (/\s/.test(password)) {
            alert("Password must not contain any spaces.");
            return;
        } else if (
            password.length < 8 || 
            !/[A-Z]/.test(password) || 
            !/[a-z]/.test(password) || 
            !/[^A-Za-z0-9]/.test(password)
        ) {
            alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.");
            return;
        }
        
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            if (user) {
                await sendEmailVerification(user);
                alert("Check your email for verification.");
                setTimeout(() => {
                    navigate("/verifyEmail");
                }, 1000);
            } else {
                console.error("User not created properly.");
            }
        } catch (error) {
            console.error("Signup error:", error.message);
            alert(`Signup failed: ${error.message}`);
        }
    };
    
    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("Google Account Connected");
            navigate("/dashboard"); // Redirect to dashboard after successful Google signup
        } catch (error) {
            console.error("Google Sign-up Error:", error.message);
            alert(`Google signup failed: ${error.message}`);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button>
                <h3 className="text-center font-bold text-blue-500 uppercase text-2xl">
                    Sign Up
                </h3>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="off"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-2"
                    >
                        Sign Up
                    </button>
                </form>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="mt-4 w-full flex justify-center items-center bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Sign up with Google
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account?</p>
                    <Link
                        to="/login"
                        className="mt-2 inline-block w-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;