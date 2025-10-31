import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config()
const prisma = new PrismaClient()


const isAdypuEmail = (email) => {
  return email.toLowerCase().endsWith('@adypu.edu.in');
};

export const createUser = async (req, res) => {

  const { 
    name, 
    email, 
    password, 
    userName, 
    gender, 
    phone, 
    hostel, 
    roomNumber, 
    academicYear // All nine required fields must be destructured
  } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newEmail = email.toLowerCase();

    if (!isAdypuEmail(newEmail)) {
        return res.status(400).json({
         message: 'Only @adypu.edu.in email addresses are allowed.',
    });
    }
    const existingUser = await prisma.user.findUnique({                              
        where : {
            email : newEmail
        }
    });



    if (existingUser) {
        return res.status(409).json({ message: "name or Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await prisma.user.create({
        data : {
            name: name,
            email: newEmail, // Assumed to be a processed email (e.g., lowercase)
            password: hashedPassword, // Assumed to be the bcrypt hash
            userName: userName, // Now included
            gender: gender, // Required Enum
            phone: phone, // Required String
            hostel: hostel, // Required Enum
            // IMPORTANT: roomNumber must be an Int, so we use parseInt()
            roomNumber: parseInt(roomNumber, 10), 
            academicYear: academicYear // Required Enum
        }
    });
    return res.status(201).json({ message: "User registered successfully",user: { id: newUser.id, name: newUser.name, email: newUser.email }, });
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
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, name: user.name },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1 * 60 * 60 * 1000,
    });
                                                                            
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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
      { id: decoded.id, name: decoded.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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
