import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not authorized. Login again." });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id; // ✅ this sets req.userId
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying token" });
  }
};

export default authMiddleware;
