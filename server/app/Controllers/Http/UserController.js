"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");

class UserController {
  async login({ request, auth, response }) {
    try {
      const token = await auth.attempt(
        request.input("email"),
        request.input("password")
      );
      return response.json({
        status: "success",
        data: token,
      });
    } catch (error) {
      response.status(400).json({
        status: "error",
        message: "Неверный логин/пароль",
      });
    }
  }

  async register({ request, auth, response }) {
    const userData = request.only(["username", "email", "password"]);

    try {
      userData["class"] = "moderator";
      const user = await User.create(userData);
      const token = await auth.generate(user);
      return response.json({
        staus: "success",
        data: token,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Произошла ошибка при регистрации, пожалуйста, повторите попытку",
      });
    }
  }

  async changePassword({ request, auth, response }) {
    const user = auth.current.user;

    const verifyPassword = await Hash.verify(
      request.input("password"),
      user.password
    );

    if (!verifyPassword) {
      return response.status(400).json({
        status: "error",
        message: "Текущий пароль не прошел проверки! Попробуйте снова",
      });
    }

    
    user.password = request.input("newPassword");
    await user.save();

    return response.json({
      status: "success",
      message: "Пароль изменен",
    });
  }

  async show({ params, response }) {
    const user = await User.find(params.id);
    const res = {
      username: user.username,
      email: user.email,
    };
    return response.json(res);
  }

  async me({auth, response}){
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select('id', 'class', 'email', 'username')
        .firstOrFail();
      return response.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "оШЫБКА",
      });
    }

  }
}


module.exports = UserController;
