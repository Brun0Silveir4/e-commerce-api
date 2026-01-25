const express = require("express");
const UserController = require("../controllers/user-controller");
const ensureAuth = require("../middlewares/EnsureAuth");

const router = express.Router();

router.post("/register", UserController.createUser)
router.post("/login", UserController.LoginUser)
router.put("/update/me", ensureAuth, UserController.updateUser)
router.put("/update/me/password", ensureAuth, UserController.updatePassword)

module.exports = router