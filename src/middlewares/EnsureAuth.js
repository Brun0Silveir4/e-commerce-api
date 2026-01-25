const jwt = require("jsonwebtoken");


function ensureAuth(req, res, next){
    const rawHeader = req.headers.authorization || "";
    const [, token] = rawHeader.split(" ");

    if(!rawHeader){
        return res.status(401).json({ error: "No token provided" });
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();

    } catch (e) {
        return res.status(401).json({ error: "Token invalid" });
    }
}

module.exports = ensureAuth;