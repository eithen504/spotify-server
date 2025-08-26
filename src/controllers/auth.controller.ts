import { Request, Response } from "express"
import axios from 'axios'
import { GoogleTokenResult } from "../types";
import User from "../models/user.model";
import JWTService from "../services/jwt";

export const verifyGoogleToken = async (req: Request, res: Response) => {
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

        const { email, name } = data

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                displayName: name,
                avatarUrl: "",
            });
        }

        const userToken = JWTService.generateTokenForUser(user.id, user.email);

        // Set the JWT in an HttpOnly cookie
        res.cookie("SPOTIFY_TOKEN", userToken, {
            httpOnly: true,
            secure: process.env.APP_ENV as string === "production", // send cookie over HTTPS in production
            sameSite: "strict", // or 'strict' depending on your CSRF policy
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });

        // Send response
        res.status(500).json({ data: user, message: "Login successful" });
    } catch (error) {
        console.error("Error in verifyGoogleToken:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        // clear the cookie
        res.clearCookie("SPOTIFY_TOKEN", {
            httpOnly: true,
            secure: process.env.APP_ENV as string === "production",
            sameSite: "strict"
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error)
        res.status(500).json({ error: "Internal server error" });
    }
};

export const checkAuth = async (req: Request, res: Response) => {
    try {
        res.status(200).json((req as any).user);
    } catch (error: any) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}