import { TagModel } from "../models/tag.model.js";

export const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newTag = await TagModel.create({
      name,
      description,
    });

    return res.status(201).json({
      msg: "Etiqueta creada correctamente",
      data: newTag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.find({ deletedAt: null }).populate("courses");

    return res.status(200).json({
      data: tags,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await TagModel.findOne({ _id: id, deletedAt: null }).populate("courses");

    return res.status(200).json({
      data: tag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedTag = await TagModel.updateOne(
      { _id: id, deletedAt: null },
      { name, description }
    );

    return res.status(200).json({
      data: updatedTag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado lógico actualizando deletedAt
    const deletedTag = await TagModel.updateOne(
      { _id: id },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      msg: "Etiqueta eliminada correctamente",
      data: deletedTag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};