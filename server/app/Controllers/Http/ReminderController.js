"use strict";

const User = require("../../Models/User");

const Reminder = use("App/Models/Reminder");
const Client = use("App/models/Client");

class ReminderController {
  async show({ params, response }) {
    try {
      const reminder = await Reminder.query()
        .where("id", params.id)
        .select("id", "client_id", "description", "date_of_remind")
        .with("client")
        .firstOrFail();
      return response.json({
        status: "success",
        data: reminder,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }

  async getAll({ response }) {
    try {
      const reminders_raw = await Reminder.all();
      const clients_raw = await Client.all();
      const reminders = reminders_raw.toJSON();
      const clients = clients_raw.toJSON();
      reminders.forEach((reminder) => {
        var client = clients.find((obj) => {
          return obj.id == reminder.client_id;
        });
        reminder.name = client.name;
        reminder.email = client.email;
        reminder.phone = client.phone;
        reminder.date_of_birth = client.date_of_birth;
      });
      JSON.stringify(reminders);
      return response.json({
        reminders,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }

  async destroy({ params, response }) {
    try {
      const reminder = await Reminder.query()
        .where("id", params.id)
        .firstOrFail();
      reminder.delete();
      return response.json({
        message: "Напоминание удалено",
        staus: "success",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка при удалении записи напоминания, обновите страницу (CTRL+F5) и повторите операцию",
      });
    }
  }

  async update({ params, request, response }) {
    try {
      const remind_new_data = request.only(["data"]);
      const remind = await Reminder.findBy("id", params.id);
      remind.client_id = remind_new_data.data.client_id;
      remind.description = remind_new_data.data.description;
      remind.date_of_remind = remind_new_data.data.date_of_remind;
      await remind.save();

      return response.status(200).json(remind);
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка при обновлении записи напоминания, обновите страницу (CTRL+F5) и повторите операцию",
      });
    }
  }
  async create({ request, response }) {
    try {
      const remind_data = request.only(["data"]);
      const remind = await Reminder.create({
        client_id: remind_data.data.client_id,
        description: remind_data.data.description,
        date_of_remind: remind_data.data.date_of_remind,
      });
      const client = await Client.findBy("id", remind_data.data.client_id);
      return response.json({
        status: "success",
        message: "Новое напоминие для " + client.name + " создано",
        data: remind,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Прозошла ошибка при создании записи клиента, обновите страницу (CTRL+F5) и повторите операцию",
      });
    }
  }
}

module.exports = ReminderController;
