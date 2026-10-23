import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { startDB } from "./src/config/database.js";
import { userRouter } from "./src/routes/user.routes.js";
import { courseRouter } from "./src/routes/course.routes.js";
import { profileRouter } from "./src/routes/profile.routes.js";
import { tagRouter } from "./src/routes/tag.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Rutas
app.use("/api", userRouter);
app.use("/api", courseRouter);
app.use("/api", profileRouter);
app.use("/api", tagRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en el puerto ${PORT}`);
});