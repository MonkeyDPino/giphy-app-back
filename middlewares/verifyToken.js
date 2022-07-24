const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.jwt;
  
  if (!authHeader) {
    return res.status(406).json({
      ok: false,
      error: "there is no token",
    });
  }

  jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
    if (err) {
      return res.status(403).json({
        ok: false,
        error: "token is not valid",
      });
    }

    req.user = user;
    next();
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.rol == "admin") {
      next();
    } else {
      return res.status(401).json({
        ok: false,
        error: "token is not valid",
      });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
