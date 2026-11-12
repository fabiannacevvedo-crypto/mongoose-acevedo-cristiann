import { matchedData } from "express-validator";
import { TagModel } from "../models/tag.model.js";
import { CourseModel } from "../models/course.model.js";

export const createTag = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const newTag = await TagModel.create(data);
    return res.status(201).json({ msg: "Etiqueta creada correctamente", data: newTag });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.find({ deletedAt: null }).populate("courses");
    return res.status(200).json({ msg: "Etiquetas obtenidas correctamente", data: tags });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const tag = await TagModel.findOne({ _id: id, deletedAt: null }).populate("courses");

    if (!tag) {
      return res.status(404).json({ msg: "Etiqueta no encontrada" });
    }

    return res.status(200).json({ msg: "Etiqueta obtenida correctamente", data: tag });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req, { locations: ["params", "body"] });

    const existing = await TagModel.findOne({ _id: id, deletedAt: null });
    if (!existing) {
      return res.status(404).json({ msg: "Etiqueta no encontrada" });
    }

    const updatedTag = await TagModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Etiqueta actualizada correctamente", data: updatedTag });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const tag = await TagModel.findOne({ _id: id, deletedAt: null });
    if (!tag) {
      return res.status(404).json({ msg: "Etiqueta no encontrada" });
    }

    // Eliminación lógica
    await TagModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } });

    // Eliminación en cascada sobre la relación N:M: quitar la etiqueta de los cursos
    await CourseModel.updateMany({ tags: id }, { $pull: { tags: id } });

    return res.status(200).json({ msg: "Etiqueta eliminada correctamente (lógica y en cascada)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
