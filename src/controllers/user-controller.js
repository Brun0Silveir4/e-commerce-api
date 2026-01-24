const userService = require("../services/user-service");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

class UserController {
  async createUser(req, res) {
    try{
        const { name, email, password } = req.body;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const existingUser = await userService.verifyEmailExists(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await userService.createUser(
      name,
      email,
      hashedPassword,
    );

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({ user: payload, token });
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
  }
}

module.exports = new UserController();
