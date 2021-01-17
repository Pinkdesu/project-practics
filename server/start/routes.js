"use strict";

const { route } = require("@adonisjs/framework/src/Route/Manager");
const UserController = require("../app/Controllers/Http/UserController");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("login", "UserController.login");
Route.post("register", "UserController.register");

Route.group(() => {
  Route.put("/change_password", "UserController.changePassword");
  Route.get("getuser/:id", "UserController.show");
})
  .prefix("users")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.get("/me", "UserController.me");
  Route.put("/update_profile", "UserController.updateProfile");
})
  .prefix("account")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.post("create", "ReminderController.remind");
  Route.get("get_reminder/:id", "ReminderController.show");
  Route.get("get_all_reminders", "ReminderController.getAll");
  Route.delete("delete_reminder/:id", "ReminderController.destroy");
  Route.put("update_reminder_info/:id", "ReminderController.update");
  Route.post("create_new_remind", "ReminderController.create");
})
  .prefix("reminders")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.get("get_all_clients", "ClientController.getAll");
  Route.delete("delete_client/:id", "ClientController.destroy");
  Route.put("update_client_info/:id", "ClientController.update");
  Route.post("create_new_client", "ClientController.create");
})
  .prefix("clients")
  .middleware(["auth:jwt"]);
