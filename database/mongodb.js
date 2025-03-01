import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("Veuillez définir le lien de la base de données MongoDB.");
}

// Connexion à la BD
export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("✅ Connecté à la base de données...");
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données :", error);
    process.exit(1); // Stoppe l'application en cas d'échec de connexion
  }
};
