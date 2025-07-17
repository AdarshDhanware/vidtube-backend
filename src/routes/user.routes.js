import { Router } from "express";
import {
    UpdateUserAvatar,
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/get-current-user").post(verifyJwt, getCurrentUser);
router.route("/update-details").post(verifyJwt, updateAccountDetails);
router.route("/change-avatar").post(
    upload.single("avatar"),
    verifyJwt,
    UpdateUserAvatar
);
router.route("/update-cover-image").post(
    upload.single("coverImage"),
    verifyJwt,
    updateCoverImage
)

export default router;
