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

      const user = await userService.verifyEmailExists(email);

      if (!user)
        return res.status(401).json({ error: "Email or password incorrect" });

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
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

      return res.status(200).json({ user: payload, token });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.user.id;

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

  async updatePassword(req, res) {
    try {
      const userId = req.user.id;

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Old password and new password are required" });
      }

      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });

      const user = await userService.findUserById(userId);

      if (user) {
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ error: "Old password is incorrect" });
        }
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        await userService.updatePassword(userId, hashedNewPassword);
        return res.status(200).json({ message: "Password updated successfully" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new UserController();
