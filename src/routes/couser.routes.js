import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/couser.controller.js";
import {
  createCourseValidator,
  updateCourseValidator,
} from "../middlewares/couser.validator.js";
import { paramIdValidator } from "../middlewares/validator.middleware.js";

export const courserRouter = Router();

courseRouter.post("/courses", createCourseValidator, createCourse);
courseRouter.get("/courses", getAllCourses);
courseRouter.get("/courses/:id", paramIdValidator, getCourseById);
courseRouter.put("/courses/:id", updateCourseValidator, updateCourse);
courseRouter.delete("/courses/:id", paramIdValidator, deleteCourse);