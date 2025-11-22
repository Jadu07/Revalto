import { prisma } from "../../DB/config.js"
import { z } from "zod";

const createPostSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemImgUrl: z.string().min(1, "Image is required"), 
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  originalPrice: z.coerce.number().positive("Original price must be positive"),
  secondHandPrice: z.coerce.number().positive("Second hand price must be positive"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  warrantyRemaining: z.enum([
    "NO_WARRANTY",
    "LESS_THAN_1_MONTH",
    "ONE_TO_THREE_MONTHS",
    "THREE_TO_SIX_MONTHS",
    "SIX_TO_NINE_MONTHS",
    "NINE_TO_TWELVE_MONTHS",
    "MORE_THAN_1_YEAR",
  ]),
  category: z.enum(["Accessories", "Food", "Electronics", "Beauty", "Fashion"]),
  isAvailable: z.boolean().optional().default(true),
  isPostedAnonymously: z.boolean().optional().default(true),
  authorId: z.coerce.number().int().positive(),
});

export const createPost = async (req, res) => {
    try {
        const validation = createPostSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.error.format(),
            });
        }

        const { itemName, itemImgUrl, description, originalPrice, secondHandPrice, condition, warrantyRemaining, isAvailable, isPostedAnonymously, authorId, category } = validation.data;


        const newPost = await prisma.post.create({
            data: {
                itemName,
                category,
                itemImgUrl,
                description,
                originalPrice: parseFloat(originalPrice),
                secondHandPrice: parseFloat(secondHandPrice),
                condition,
                warrantyRemaining,
                isAvailable: isAvailable ?? true,
                isPostedAnonymously: isPostedAnonymously ?? true,
                authorId: parseInt(authorId),
            },
            include: {
                author: {
                    select: {
                        id: true, 
                        name: true, 
                        email: true 
                    },
                },
            },
        });

        res.status(201).json({
            message: "Post created successfully.",
            post: newPost,
        });
    }catch(error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

export const getPosts = async(req,res) => {
    try {
        const category = req.query.category || req.params.category;
        // console.log(req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const whereClause = category? {category} : {}
        const posts = await prisma.post.findMany({
          where: whereClause,
          skip: skip,
          take: limit,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
        if (!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No posts found for category "${category}". Try another category.`,
        });
    }
        return res.status(200).json(posts)
    }catch(error){
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}

export const getPostById = async(req,res) => {
    try {
        const postId = parseInt(req.params.id);
        
        if (isNaN(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        email: true,
                        imgUrl: true,
                        annonymousImgUrl: true,
                        isProfileAnonymous: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json(post);
    } catch(error) {
        console.error("Error fetching post by ID:", error);
        res.status(500).json({ 
            message: "Internal server error.", 
            error: error.message 
        });
    }
}

