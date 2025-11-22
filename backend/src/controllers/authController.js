import {prisma} from "../../DB/config.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email().endsWith("@adypu.edu.in", {
    message: "Only @adypu.edu.in email addresses are allowed."
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }),
  userName: z.string().min(3, {
    message: "Username must be at least 3 characters"
  }).max(20, {
    message: "Username cannot exceed 20 characters"
  }),
});


export const createUser = async (req, res) => {

  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.format(),
      });
    }
    const { email, password, userName } = validation.data;
    const newEmail = email.toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { userName: userName },
          { email: newEmail }
        ]
      }
    });


    if (existingUser) {
        return res.status(409).json({ message: "name or Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await prisma.user.create({
        data : {
            email: newEmail, 
            password: hashedPassword, 
            userName: userName, 
        }
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, userName: newUser.userName, email: newUser.email },
    });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error during registration" });
    }
}





export const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email or name and Password are required" });                
    }
    const user = await prisma.user.findUnique({
        where : {
            email
        }
    });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path : "/",
      maxAge: 1 * 60 * 60 * 1000,
    });
                                                                            
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path : "/",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const renewAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(404).json({ message: "Please Re-Login" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {                  
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.json({ message: "Token refreshed successfully" });
  });
};

export const logout =  (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",                                                      
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
