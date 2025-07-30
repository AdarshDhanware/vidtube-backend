import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const videoComment =Comment.aggregate([
        {
            $match:{
                video:new mongoose.Schema.Types.ObjectId(videoId)
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        }
    ])

    const comment = await Comment.aggregatePaginate(videoComment,{page,limit});

    if(!comment){
        throw new ApiError(404,"No comment found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment fetched successfully"
        )
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const userId = req.user._id

    if(!userId){
        throw new ApiError(404,"Unauthorized Access")
    }

    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(404,"Video not found")
    }

    const {content} = req.body;

    if(!content || content.trim()===""){
        throw new ApiError(400,"Empty field")
    }

    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:userId
    })

    const check = await Comment.findOne(comment._id);

    if(!check){
        throw new ApiError(409,"Comment failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment successfully"
        )
    )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const {content} = req.body;

    if(!content || content.trim() ===""){
        throw new ApiError(409,"Empty fields")
    }

    if(!commentId){
        throw new ApiError(404,"Comment not found")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new:true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(404,"Comment not found")
    }

    await Comment.findByIdAndDelete(commentId)

    const check = await Comment.findOne({commentId})

    if(check){
        throw new ApiError(409,"Comment not deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Comment deleted Successfully"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }