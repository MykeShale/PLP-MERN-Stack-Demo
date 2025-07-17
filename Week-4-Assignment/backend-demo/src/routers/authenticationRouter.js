import { Router } from "express";
import { signinUser, signupUser } from "../controllers/authController.js";

const router = Router();

// Signup route
router.post("/signup", signupUser);

// Signin route
router.post("/signin", signinUser);

const authRouter = router;
export default authRouter;
