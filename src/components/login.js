import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

const LoginComponent = () => {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) {
        return;
        }
        if (user) navigate("/home");
    }, [user, loading]);

    return (
        <div className="login">
        <div className="login__container">
            <p>Login/Register with Google</p>
            <button className="login__btn login__google" onClick={signInWithGoogle}>
            Google Login
            </button>
        </div>
        </div>
    );

};

export default LoginComponent;