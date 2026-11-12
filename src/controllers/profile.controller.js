import { matchedData } from "express-validator";
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";

export const createProfile = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const newProfile = await ProfileModel.create(data);

    // Vincular perfil al usuario (relación 1:1 referenciada)
    await UserModel.updateOne({ _id: data.user }, { $set: { profile: newProfile._id } });

    return res.status(201).json({ msg: "Perfil creado correctamente", data: newProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.find({ deletedAt: null }).populate("user");
    return res.status(200).json({ msg: "Perfiles obtenidos correctamente", data: profiles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const profile = await ProfileModel.findOne({ _id: id, deletedAt: null }).populate("user");

    if (!profile) {
      return res.status(404).json({ msg: "Perfil no encontrado" });
    }

    return res.status(200).json({ msg: "Perfil obtenido correctamente", data: profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req, { locations: ["params", "body"] });

    const existing = await ProfileModel.findOne({ _id: id, deletedAt: null });
    if (!existing) {
      return res.status(404).json({ msg: "Perfil no encontrado" });
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("user");

    return res.status(200).json({ msg: "Perfil actualizado correctamente", data: updatedProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const profile = await ProfileModel.findOne({ _id: id, deletedAt: null });
    if (!profile) {
      return res.status(404).json({ msg: "Perfil no encontrado" });
    }

    await ProfileModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } });
    // Desvincular del usuario (cascada en la relación 1:1)
    await UserModel.updateOne({ _id: profile.user }, { $set: { profile: null } });

    return res.status(200).json({ msg: "Perfil eliminado correctamente (eliminación lógica)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
