const userController = require("../controllers/user-controller");
const userService = require("../services/user-service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { describe } = require("node:test");

jest.mock("../services/user-service");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller - create User", () => {
  it("should create a user successfully", async () => {
    const req = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "123456",
      },
    };

    const res = mockResponse();

    bcrypt.hashSync.mockReturnValue("hashedPassword");

    userService.verifyEmailExists.mockResolvedValue(false);

    userService.createUser.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      role: "customer",
    });

    jwt.sign.mockReturnValue("fake-token")

    await userController.createUser(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        user: {
            id: 1,
            name: "test",
            email: "test@email.com",
            role: "customer"
        },
        token: "fake-token"
    })
  });
});
