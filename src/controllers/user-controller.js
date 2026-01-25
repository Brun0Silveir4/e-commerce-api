const userService = require("../services/user-service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  async createUser(req, res) {
    try {
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

      const user = await userService.createUser(name, email, hashedPassword);

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res.status(201).json({ user: payload, token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async LoginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.loginUser(email, password);

      if (!user)
        return res.status(401).json({ error: "Email or password incorrect" });

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res.json({ user: payload, token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async updateUser(req, res) {
    try {
      const rawHeader = req.headers.authorization || "";
      const authHeader = rawHeader.includes(" ")
        ? rawHeader.split(" ")[1]
        : rawHeader;
      if (!authHeader) return res.status(401).json({ error: "No token provided" });

      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { name, email } = req.body;

      const updatedUser = await userService.updateUser(userId, { name, email });

      return res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new UserController();
