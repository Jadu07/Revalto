import express from "express";
import { createPost, getPosts, getPostByPostId,getPostByAuthorId,updatePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", createPost);
router.get('/',getPosts)
router.get('/id/:id', getPostByPostId)
router.get('/author/:id', getPostByAuthorId)
router.get('/:category',getPosts)
router.put("/update/:id",updatePost)

export default router;
