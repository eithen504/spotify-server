import { Request, Response } from "express"
import axios from 'axios'
import { GoogleTokenResult } from "../types";
import User from "../models/user.model";
import JWTService from "../services/jwt";

const checkAuth = async (req: Request, res: Response) => {
    try {
        res.status(200).json((req as any).user);
    } catch (error: any) {
        console.error("Error in checkAuth:", error)
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}

const verifyGoogleToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set("id_token", token);

        const { data } = await axios.get<GoogleTokenResult>(
            googleOauthURL.toString(),
            {
                responseType: "json",
            }
        );

        const { email } = data

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                displayName: email.split('@')[0],
                avatarUrl: "",
            });
        }

        const userToken = JWTService.generateTokenForUser(user.id, user.email);

        // Set the JWT in an HttpOnly cookie
        res.cookie("SPOTIFY_TOKEN", userToken, {
            httpOnly: true,
            secure: process.env.APP_ENV === "production",
            sameSite: "lax",
            maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
        });

        // Send response
        res.status(500).json({ data: user, message: "Login successful" });
    } catch (error) {
        console.error("Error in verifyGoogleToken:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const logoutUser = async (req: Request, res: Response) => {
    try {
        // clear the cookie
        res.clearCookie("SPOTIFY_TOKEN", {
            httpOnly: true,
            secure: process.env.APP_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

export {
    checkAuth,
    verifyGoogleToken,
    logoutUser
}