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

  async loginUser(email, password){
    const user = await prisma.user.findUnique({
        where: {email}
    })
    if (!user) return null 

    const passwordMatch = bcrypt.compareSync(password, user.password)

    if (!passwordMatch) return null
    
    return user
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
}

module.exports = new UserService();
