const userController = require("../controllers/user-controller");
const userService = require("../services/user-service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    userService.verifyEmailExists.mockResolvedValue(false);

    userService.createUser.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      role: "customer",
    });

    jwt.sign.mockReturnValue("fake-token");

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        name: "test",
        email: "test@email.com",
        role: "customer",
      },
      token: "fake-token",
    });
  });
});

describe("User Controller - email invalid", () => {
  it("Should return 400 if email is invalid", async () => {
    const req = {
      body: {
        name: "Test",
        email: "invalid-email",
        password: "123456",
      },
    };
    const res = mockResponse();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email format",
    });
  });
});

describe("User Controller - email already in use", () => {
  it("Should return 400 if email is already in use", async () => {
    const req = {
      body: {
        name: "Test",
        email: "teste@email.com",
        password: "123456",
      },
    };
    const res = mockResponse();

    userService.verifyEmailExists.mockResolvedValue({
      id: 1,
      name: "test",
      email: "teste@email.com",
    });

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email already in use",
    });
  });
});

describe("User Controller - password too short", () => {
  it("Should return 400 if password is too short", async () => {
    const req = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "123",
      },
    };
    const res = mockResponse();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Password must be at least 6 characters long",
    });
  });
});

describe("User controller - internal server error", () => {
  it("Should return 500 if there is an internal server error", async () => {
    const req = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "123456",
      },
    };
    const res = mockResponse();
    userService.verifyEmailExists.mockRejectedValue(
      new Error("Database error"),
    );
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database error",
    });
  });
});

describe("User Controller - Login user", () => {
  it("should login a user successfully", async () => {
    const req = {
      body: {
        email: "test@email.com",
        password: "123456",
      },
    };

    const res = mockResponse();

    userService.verifyEmailExists.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      password: "hashed-password",
      role: "customer",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");

    await userController.LoginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        name: "test",
        email: "test@email.com",
        role: "customer",
      },
      token: "fake-token",
    });
  });
});

describe("User Controller - Login user invalid email", () => {
  it("should return 401 if email is invalid", async () => {
    const req = {
      body: {
        email: "teste@email.com",
        password: "123456",
      },
    };

    const res = mockResponse();

    userService.verifyEmailExists.mockResolvedValue(null);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue("fake-token");

    await userController.LoginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email or password incorrect",
    });
  });
});

describe("User Controller - login user invalid password", () => {
  it("should return 401 if password is invalid", async () => {
    const req = {
      body: {
        email: "test@email.com",
        password: "wrong-password",
      },
    };
    const res = mockResponse();

    userService.verifyEmailExists.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      password: "hashed-password",
      role: "customer",
    });

    bcrypt.compare.mockResolvedValue(false);

    await userController.LoginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email or password incorrect",
    });
  });
});

describe("User controller - Login user internal server error", () => {
  it("should return 500 if there is an internal server error", async () => {
    const req = {
      body: {
        email: "test@email.com",
        password: "123456",
      },
    };
    const res = mockResponse();

    userService.verifyEmailExists.mockRejectedValue(
      new Error("Database error"),
    );
    await userController.LoginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("User controller - update user name", () => {
  it("should update user name successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        name: "Updated Name",
      },
    };
    const res = mockResponse();
    userService.updateUser.mockResolvedValue({
      id: 1,
      name: "Updated Name",
      email: "test@email.com",
      role: "customer",
    });
    await userController.updateUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "Updated Name",
      email: "test@email.com",
      role: "customer",
    });
  });
});

describe("User Controller - update user email", () => {
  it("should update user email successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        email: "updated@email.com",
      },
    };

    const res = mockResponse();

    userService.updateUser.mockResolvedValue({
      id: 1,
      name: "test",
      email: "updated@email.com",
      role: "customer",
    });
    await userController.updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "test",
      email: "updated@email.com",
      role: "customer",
    });
  });
});

describe("User Controller - update user internal server error", () => {
  it("should return 500 if there is an internal server error", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        name: "Updated name",
      },
    };

    const res = mockResponse();

    userService.updateUser.mockRejectedValue(new Error("Database error"));
    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});

describe("User Controller - update user password", () => {
  it("should update user password successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        oldPassword: "old-password",
        newPassword: "new-password",
      },
    };
    const res = mockResponse();

    userService.findUserById.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      password: "hashed-old-password",
      role: "customer",
    });

    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hashSync.mockReturnValue("hashed-new-password");

    userService.updatePassword.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test@email.com",
      password: "hashed-new-password",
      role: "customer",
    });
    await userController.updatePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password updated successfully",
    });
  });
});
