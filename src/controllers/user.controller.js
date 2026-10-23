import { UserModel } from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, age, address, profile } = req.body;

    const newUser = await UserModel.create({
      name,
      email,
      age,
      address,
      profile,
    });

    return res.status(201).json({
      msg: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null })
      .populate("profile")
      .populate("courses");

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ _id: id, deletedAt: null })
      .populate("profile")
      .populate("courses");

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, address, profile } = req.body;

    const updatedUser = await UserModel.updateOne(
      { _id: id, deletedAt: null },
      { name, email, age, address, profile }
    );

    return res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado lógico actualizando deletedAt
    const deletedUser = await UserModel.updateOne(
      { _id: id },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      msg: "Usuario eliminado correctamente",
      data: deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};