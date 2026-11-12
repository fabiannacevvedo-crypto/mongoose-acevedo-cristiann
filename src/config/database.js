import mongoose from "mongoose";

export const startDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db-mongoose-tlp";
    await mongoose.connect(uri);
    console.log("Conectado a la base de datos correctamente");
  } catch (error) {
    console.log("No se pudo conectar a la base de datos", error);
    process.exit(1);
  }
};
