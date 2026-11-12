import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { ProfileModel } from "../models/profile.model.js";
import { CourseModel } from "../models/course.model.js";

export const createUser = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const newUser = await UserModel.create(data);

    return res.status(201).json({
      msg: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null })
      .populate("profile")
      .populate("courses");

    return res.status(200).json({ msg: "Usuarios obtenidos correctamente", data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const user = await UserModel.findOne({ _id: id, deletedAt: null })
      .populate("profile")
      .populate("courses");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Usuario obtenido correctamente", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req, { locations: ["params", "body"] });

    const existing = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!existing) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("profile")
      .populate("courses");

    return res.status(200).json({ msg: "Usuario actualizado correctamente", data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const user = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const deletedAt = new Date();

    // Eliminación lógica del usuario
    await UserModel.updateOne({ _id: id }, { $set: { deletedAt, profile: null } });

    // Eliminación en cascada (lógica): perfil 1:1 asociado
    await ProfileModel.updateMany({ user: id, deletedAt: null }, { $set: { deletedAt } });

    // Eliminación en cascada (lógica): cursos 1:N donde es instructor
    await CourseModel.updateMany({ instructor: id, deletedAt: null }, { $set: { deletedAt } });

    return res.status(200).json({ msg: "Usuario eliminado correctamente (eliminación lógica en cascada)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
