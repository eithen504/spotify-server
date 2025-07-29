import JWT from "jsonwebtoken";
import { JWTUser } from "../types";

class JWTService {
    public static generateTokenForUser(id: string, email: string) {
        const payload: JWTUser = {
            id,
            email,
        };
        const token = JWT.sign(payload, process.env.JWT_SECRET || "");
        return token;
    }

    public static decodeToken(token: string) {
        try {
            return JWT.verify(token, process.env.JWT_SECRET || "") as JWTUser;
        } catch (error) {
            return null;
        }
    }
}

export default JWTService;