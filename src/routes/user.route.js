import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    register,loginUser,logoutuser,refreshAccesstoken,changecurrentpassword,getcurrentuser
} from "../controllers/user.controller.js"
const router = Router()

router.route("/register").post(register)
router.route("/login-user").post(loginUser)
router.route("/logout").post(verifyJWT,logoutuser)
router.route("/refresh-token").post(refreshAccesstoken)
router.route("/change-password").post(verifyJWT,changecurrentpassword)
router.route("/me").get(verifyJWT,getCurrentUser)

export default router;

