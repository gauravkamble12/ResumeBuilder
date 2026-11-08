
const { Router } = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware=require("../middleware/auth.middleware")
const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route   POST /api/auth/login
 * @desc    Log in a user with email and password
 * @access  public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear cookie from user cookie and add teh token in blacklist
 * @access public
 */
authRouter.get("/logout",authController.logoutUserController);

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access public
 */

authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports = authRouter;
