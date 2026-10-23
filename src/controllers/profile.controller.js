import { ProfileModel } from "../models/profile.model.js";

export const createProfile = async (req, res) => {
  try {
    const { user, bio, phone, website, github } = req.body;

    const newProfile = await ProfileModel.create({
      user,
      bio,
      phone,
      website,
      github,
    });

    return res.status(201).json({
      msg: "Perfil creado correctamente",
      data: newProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.find({ deletedAt: null }).populate("user");

    return res.status(200).json({
      data: profiles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProfileModel.findOne({ _id: id, deletedAt: null }).populate("user");

    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, phone, website, github } = req.body;

    const updatedProfile = await ProfileModel.updateOne(
      { _id: id, deletedAt: null },
      { bio, phone, website, github }
    );

    return res.status(200).json({
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado lógico actualizando deletedAt
    const deletedProfile = await ProfileModel.updateOne(
      { _id: id },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      msg: "Perfil eliminado correctamente",
      data: deletedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};