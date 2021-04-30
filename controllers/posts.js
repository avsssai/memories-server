import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
	try {
		const postMessages = await PostMessage.find();
		return res.status(200).json(postMessages);
	} catch (error) {
		return res.status(404).json({
			message: error.message,
		});
	}
};

export const createPost = async (req, res) => {
	const post = req.body;
	const newPost = new PostMessage(post);
	try {
		await newPost.save();
		return res.status(200).json(newPost);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;
	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send("No post with that id.");
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(
		_id,
		{ ...post, _id },
		{
			new: true,
		}
	);
	return res.json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id))
		res.status(404).send("No post found.");
	try {
		await PostMessage.findByIdAndRemove(_id);
		return res.json({
			message: "Post deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return res.json({
			error: "Error deleting post",
		});
	}
};

export const likePost = async (req, res) => {
	const { id: _id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(_id)) {
		res.status(404).send("No post found.");
	}
	try {
		const post = await PostMessage.findById(_id);
		const updatedPost = await PostMessage.findOneAndUpdate(
			_id,
			{
				likeCount: post.likeCount + 1,
			},
			{ new: true }
		);
		return res.json(updatedPost);
	} catch (error) {
		return res.json({
			error: "Error liking post",
		});
	}
};
