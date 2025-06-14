import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null;
        if (!token) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Token not found.User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default protectRoute;
