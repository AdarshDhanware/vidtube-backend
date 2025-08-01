import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet content is required.");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(400, "Unauthorized access");
    }

    const newTweet = await Tweet.create({
        owner: user._id,
        content: content,
    });

    const check = await Tweet.findById(newTweet._id);
    if (!check) {
        throw new ApiError(500, "Failed to verify tweet creation");
    }

    return res.status(200).json(new ApiResponse(200, newTweet, "Tweet done"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    const userTweet = await Tweet.find({ owner: userId });

    if (!userTweet) {
        throw new ApiError(500, "Error fetching tweets");
    }

    if (!userTweet.length) {
        throw new ApiError(401, "No tweet find");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, userTweet, "Tweet fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;

    const { content } = req.body;
    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, owner: user._id },
        {
            content,
        },
        {
            new: true,
        }
    );

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or not authorized to update");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet update sucessfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new ApiError(409, "An error occured");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: user._id,
    });
    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or not authorized to delete");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
