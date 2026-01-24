const prisma = require("../database");

class UserService {
  async createUser(name, email, password) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return user;
  }

  async verifyEmailExists(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}

module.exports = new UserService();
