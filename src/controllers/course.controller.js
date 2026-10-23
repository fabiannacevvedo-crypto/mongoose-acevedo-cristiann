import { CourseModel } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, instructor, tags } = req.body;

    const newCourse = await CourseModel.create({
      title,
      description,
      price,
      instructor,
      tags,
    });

    return res.status(201).json({
      msg: "Curso creado correctamente",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ deletedAt: null })
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({
      data: courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await CourseModel.findOne({ _id: id, deletedAt: null })
      .populate("instructor")
      .populate("tags");

    return res.status(200).json({
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, instructor, tags } = req.body;

    const updatedCourse = await CourseModel.updateOne(
      { _id: id, deletedAt: null },
      { title, description, price, instructor, tags }
    );

    return res.status(200).json({
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado lógico actualizando deletedAt
    const deletedCourse = await CourseModel.updateOne(
      { _id: id },
      { deletedAt: new Date() }
    );

    return res.status(200).json({
      msg: "Curso eliminado correctamente",
      data: deletedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};