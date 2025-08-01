import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    // toggle like on video
    if(!videoId){
        throw new ApiError(404,"Video not found")
    }

    const userId = req.user._id

    if(!userId){
        throw new ApiError(401,"Unauthorized access")
    }

    const videoLike = await Like.create(
        {
            video:videoId,
            likedBy:userId
        }
    )

    const check = await Like.findById(videoLike._id)
    
    if(!check){
        throw new ApiError(409,"Video not liked")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoLike,
            "Video liked successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // toggle like on comment
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized access")
    }

    const commentLike = await Like.create(
        {
            likedBy:userId,
            comment:commentId
        }
    )

    const check =  await Like.findById(commentLike._id)
    if(!check){
        throw new ApiError(409,"Comment not liked")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            commentLike,
            "Comment like successfully"
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    // toggle like on tweet
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"Unauthorized access")
    }

    const tweetLike = await Like.create(
        {
            likedBy:userId,
            tweet:tweetId
        }
    )

    const check =  await Like.findById(tweetLike._id)
    if(!check){
        throw new ApiError(409,"Comment not liked")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweetLike,
            "Tweet like successfully"
        )
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    // get all liked videos
    const {page=1,limit=10} = req.query

    const userId = req.user;
    if(!userId){
        throw new ApiError(401,"Unauthorized access")
    }

    const likedDoc = await Like.find(
        {
            likedBy:userId,
            video:{ $ne:null }
        }
    );

    const likedIds = likedDoc.map((doc) => doc.video);

    console.log(likedIds)

    if(!likedDoc.length){
        throw new ApiError(404,"No liked videos found")
    }

    const videoQuery = Video.aggregate(
        [
            {
                $match:{
                    _id:{ $in :likedIds}
                }
            },
            {
                $sort:{
                    createdAt:-1    
                }
            }
        ]
    )

    const videos = await Video.aggregatePaginate(videoQuery,{page,limit});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Liked videos fetched successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}