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
}

module.exports = new UserService();
