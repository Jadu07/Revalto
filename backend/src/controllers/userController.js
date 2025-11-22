import { prisma } from "../../DB/config.js";
import bcrypt from "bcrypt";
import { z } from "zod";

const updateProfileSchema = z.object({
  // .optional() allows undefined (not provided) values it is same as saying "The user didn't touch this field, so keep the existing image as it is."
  name: z.string().min(2).max(50).optional(),
  password: z.string().min(6).optional(),
  gender: z.enum(["Male", "Female", "Others"]).optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  hostel: z
    .enum(["Your_Space_01", "Your_Space_02", "UniSpace_Boys", "UniSpace_Girls"])
    .optional(),
  roomNumber: z.coerce.number().int().optional(),
  academicYear: z.enum(["First", "Second", "Third", "Fourth"]).optional(),
  isProfileAnonymous: z.boolean().optional(),
  // Allow a valid URL to update, undefined(optional) to skip (keep current), or an empty string to explicitly delete the image
  imgUrl: z.string().url().optional().or(z.literal("")),
  annonymousImgUrl: z.string().url().optional(),
});

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.format(),
      });
    }
    const { isVerified, id, email, createdAt, updatedAt, ...allowedUpdates } = validation.data;

    if (allowedUpdates.password) {
      const hashedPassword = await bcrypt.hash(allowedUpdates.password, 10);
      allowedUpdates.password = hashedPassword;
    } else {
      delete allowedUpdates.password;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: allowedUpdates,
    });

    return res.status(200).json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        userName: true,
        email: true,
        imgUrl: true,
        annonymousImgUrl: true,
        gender: true,
        phone: true,
        hostel: true,
        roomNumber: true,
        isVerified: true,
        isProfileAnonymous: true,
        academicYear: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
