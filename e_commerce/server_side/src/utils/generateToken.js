const jwt = require("jsonwebtoken");

const generateToken = (userId, role = "user") => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
  const expire = process.env.JWT_EXPIRE || "7d";

  const token = jwt.sign(
    {
      id: userId,
      role: role,
    },
    secret,
    {
      expiresIn: expire,
    }
  );

  return token;
};

const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
