const User = require('./../models/user');
const { decodeToken } = require('./../services/jwt');

module.exports = () => {
    return async (req, res, next) => {
        try {
            const token = req.body.token;
            if (!token) return res.status(400).json({ message: "Token Missing. Please Sign In Again To Access This Page. "});

            const decodedToken = decodeToken(token);
            if (!decodedToken) return res.status(400).json({ message: "Session Expired. Please Sign In Again To Access This Page. "});

            req.user = decodedToken;
            next();
        } catch (error) {
            next(error);
        }
    }
}