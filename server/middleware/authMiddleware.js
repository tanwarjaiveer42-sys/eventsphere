const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "No token, access denied"
        });
    }

    try {
        token = token.split(" ")[1];

        console.log("TOKEN RECEIVED:", token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);

        res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = protect;