import React, { useState } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);

    const handleCheckVerification = async () => {
        try {
            await user.reload(); // Refresh user info
            if (user.emailVerified) {
                alert("Email verified! Redirecting...");
                navigate("/dashboard");
            } else {
                alert("Your email is not verified yet. Please check your inbox.");
            }
        } catch (error) {
            console.error("Verification check error:", error.message);
            alert("An error occurred while checking verification status.");
        }
    };

    const handleResendVerification = async () => {
        if (!emailSent) {
            try {
                await sendEmailVerification(user);
                setEmailSent(true);
                alert("Verification email resent! Please check your inbox.");
            } catch (error) {
                console.error("Resend error:", error.message);
                alert(`Failed to resend: ${error.message}`);
            }
        } else {
            alert("Please wait before resending another email.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-bold text-blue-500">Verify Your Email</h3>
                <p className="mt-4 text-gray-600">
                    A verification link was sent to your email. Please check your inbox and click the link to verify your account.
                </p>

                <button
                    onClick={handleCheckVerification}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    I've Verified, Refresh Status
                </button>

                <button
                    onClick={handleResendVerification}
                    className="mt-3 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                    Resend Verification Email
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;