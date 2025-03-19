import jwt from "jsonwebtoken";
import { errHandler } from "../Utils/error.js";

export const verifyToken = (req, res, next) => {
    console.log("Cookies received:", req.cookies); // Debugging
    const token = req.cookies?.access_token;

    if (!token) {
        console.log("Unauthorized: No token provided");
        return next(errHandler(401, "Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.log("JWT Verification Failed:", err.message);
            return next(errHandler(403, "Forbidden"));
        }

        console.log("Decoded Token:", decodedToken);
        req.user = decodedToken; // Correctly store user data from token
        next();
    });
};
