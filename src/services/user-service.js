const prisma = require("../database");
const bcrypt = require("bcrypt");

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

  async updateUser(id, data) {
    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });
    return updatedUser;
  }

  async updatePassword(id, newPassword) {
    const updatedUser = await prisma.user.update({
        where: {id},
        data: {password: newPassword}
    })

    return updatedUser
  }

  async findUserById(id) {
    const user = await prisma.user.findUnique({
        where: {id}
    })
    return user
  }
}

module.exports = new UserService();
