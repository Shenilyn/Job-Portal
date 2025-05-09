import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                const resend = window.confirm(
                    "Your email is not verified. Would you like to resend the verification email?"
                );
                if (resend) {
                    await sendEmailVerification(user);
                    alert("Verification email sent! Please check your inbox.");
                    navigate("/verifyEmail");
                } else {
                    alert("Please verify your email before logging in.");
                }
                return;
            }

            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error.message);
            alert(`Login failed: ${error.message}`);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            if (user) {
                await user.reload();
                const refreshedUser = auth.currentUser;

                if (refreshedUser.emailVerified) {
                    console.log("Google Account Connected and Email Verified");
                    navigate("/dashboard");
                } else {
                    const resend = window.confirm(
                        "Your Google account email is not verified. Would you like to send a verification email?"
                    );
                    if (resend) {
                        await sendEmailVerification(refreshedUser);
                        alert("Verification email sent! Please check your inbox.");
                    } else {
                        alert("Please verify your Google account email before proceeding.");
                    }
                    navigate("/verifyEmail");
                }
            } else {
                console.error("User not authenticated properly.");
            }
        } catch (error) {
            console.error("Google Login Error:", error.message);
            alert(`Google login failed: ${error.message}`);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email address to reset your password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Please check your inbox.");
        } catch (error) {
            console.error("Password reset error:", error.message);
            alert(`Failed to send password reset email: ${error.message}`);
        }
    };

    const handleClose = () => {
        navigate("/");
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
                <h3 className="text-center font-bold text-blue-500 text-2xl">Login</h3>
                <form className="mt-4 space-y-4" onSubmit={handleLogin}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700">Email:</label>
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
                        <label htmlFor="password" className="text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="off"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="mt-2 text-sm text-blue-500 hover:underline text-left"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-2"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mt-4 w-full flex justify-center items-center bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <Link
                        to="/signup"
                        className="mt-2 inline-block w-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;