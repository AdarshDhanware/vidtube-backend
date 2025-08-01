import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    //TODO: create playlist
    if (!name || !description) {
        throw new ApiError(404, "Empty fields");
    }

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(404, "Unauthorized access");
    }

    const newPlaylist = await Playlist.create({
        name: name,
        description: description,
        owner: userId,
    });

    const check = await Playlist.findById(newPlaylist._id);
    if (!check) {
        throw new ApiError(404, "Playlist creation failed");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, newPlaylist, "Playlist created successfully")
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!userId) {
        throw new ApiError(404, "Unauthorized access");
    }

    const userPlaylist = await Playlist.find({ owner: userId });

    if (!userPlaylist) {
        throw new ApiError(
            404,
            "An error occured while fetching the playlists"
        );
    }

    if (userPlaylist.length === 0) {
        throw new ApiError(404, "No playlist found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userPlaylist, "Playlist fetched successfully")
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    //TODO: get playlist by id
    if (!playlistId) {
        throw new ApiError(404, "No playlist found");
    }

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(404, "Unauthorized access");
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const videoIds = playlist.videos.map(
        (id) => new mongoose.Types.ObjectId(id)
    );

    if (videoIds.length === 0) {
        throw new ApiError(404, "No video found in playlist.");
    }

    const currentPlaylist = Video.aggregate([
        {
            $match: {
                _id: { $in: videoIds },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);

    const videoInCurrentPlaylist = await Video.aggregatePaginate(
        currentPlaylist,
        { page, limit }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoInCurrentPlaylist.docs,
                "All video fetched in current playlist"
            )
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(404, "Unauthorized accesss");
    }

    if (!playlistId || !videoId) {
        throw new ApiError(404, "An error occured");
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist");
    }

    await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: userId },
        {
            $addToSet: { videos: videoId },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "Video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(404, "Unauthorized access");
    }

    await Playlist.findOneAndUpdate(
        {_id:playlistId,owner:userId},
        {
            $pull: { videos: videoId },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "Unauthorized access");
    }

    await Playlist.findOneAndDelete({ _id: playlistId, owner: user._id });

    return res
        .status(200)
        .json(new ApiResponse(200, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    const user = req.user;
    if (!user) {
        throw new ApiError(404, "Unauthorized access");
    }

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(404, "Empty fields are not accepted");
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: user._id });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;

    const updatedPlaylist = await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
