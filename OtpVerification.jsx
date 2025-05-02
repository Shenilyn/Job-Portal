import React, { useState } from "react";
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const OtpVerification = ({ email }) => {
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const verifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const otpsRef = collection(db, "otps");
            const q = query(
                otpsRef,
                where("email", "==", email),
                where("otp", "==", otp),
                where("used", "==", false),
                orderBy("createdAt", "desc"),
                limit(1)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErrorMessage("Invalid OTP. Please try again.");
                return;
            }

            const otpDoc = querySnapshot.docs[0];
            const otpData = otpDoc.data();

            const createdAt = otpData.createdAt.toDate();
            const now = new Date();
            const diffMinutes = (now - createdAt) / (1000 * 60);

            if (diffMinutes > 10) {
                setErrorMessage("OTP has expired. Please request a new one.");
                return;
            }

            await updateDoc(doc(db, "otps", otpDoc.id), { used: true });

            console.log("Login successfully completed");
            navigate("/dashboard");
        } catch (error) {
            console.error("OTP verification failed:", error.message);
            setErrorMessage("Verification failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Enter OTP</h2>
            <form onSubmit={verifyOtp}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
                <button type="submit">Verify OTP</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default OtpVerification;
