import { matchedData } from "express-validator";
import { CourseModel } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const newCourse = await CourseModel.create(data);

    const populated = await CourseModel.findById(newCourse._id)
      .populate("instructor")
      .populate("tags");

    return res.status(201).json({ msg: "Curso creado correctamente", data: populated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ deletedAt: null })
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({ msg: "Cursos obtenidos correctamente", data: courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const course = await CourseModel.findOne({ _id: id, deletedAt: null })
      .populate("instructor")
      .populate("tags");

    if (!course) {
      return res.status(404).json({ msg: "Curso no encontrado" });
    }

    return res.status(200).json({ msg: "Curso obtenido correctamente", data: course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req, { locations: ["params", "body"] });

    const existing = await CourseModel.findOne({ _id: id, deletedAt: null });
    if (!existing) {
      return res.status(404).json({ msg: "Curso no encontrado" });
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({ msg: "Curso actualizado correctamente", data: updatedCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });

    const course = await CourseModel.findOne({ _id: id, deletedAt: null });
    if (!course) {
      return res.status(404).json({ msg: "Curso no encontrado" });
    }

    // Eliminación lógica
    await CourseModel.updateOne({ _id: id }, { $set: { deletedAt: new Date() } });

    return res.status(200).json({ msg: "Curso eliminado correctamente (eliminación lógica)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// Endpoint N:M: agregar un nuevo vínculo curso-etiqueta
export const addTagToCourse = async (req, res) => {
  try {
    const { id, tagId } = matchedData(req, { locations: ["params", "body"] });

    const updated = await CourseModel.findByIdAndUpdate(
      id,
      { $addToSet: { tags: tagId } },
      { new: true }
    )
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({ msg: "Etiqueta vinculada al curso correctamente", data: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// Endpoint N:M: quitar vínculo curso-etiqueta
export const removeTagFromCourse = async (req, res) => {
  try {
    const { id, tagId } = matchedData(req, { locations: ["params"] });

    const updated = await CourseModel.findByIdAndUpdate(
      id,
      { $pull: { tags: tagId } },
      { new: true }
    )
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({ msg: "Etiqueta desvinculada del curso correctamente", data: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
