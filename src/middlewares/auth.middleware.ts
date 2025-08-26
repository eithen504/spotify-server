import { Request, Response, NextFunction } from "express";
import JWTService from "../services/jwt";
import User from "../models/user.model";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.SPOTIFY_TOKEN;

        if (!token) {
            (req as any).user = null;
            return next();
        }

        const jwtUser = JWTService.decodeToken(token);

        if (!jwtUser) {
            (req as any).user = null;
            return next();
        }

        const user = await User.findById(jwtUser.id).select("-password");

        if (!user) {
            (req as any).user = null;
            return next();
        }

        (req as any).user = user;
        next();
    } catch (error: any) {
        console.log("error", error.message);
        (req as any).user = null;
        next();
    }
};
