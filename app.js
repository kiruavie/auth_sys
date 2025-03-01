import express from "express";
import { connectDB } from "./database/mongodb.js";
import { authRoutes } from "./routes/auth.route.js";

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Nous sommes connecté...! :)");
});

// connexion à la BD avant de lancer le serveur

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Échec du démarrage du serveur :", error);
    process.exit(1);
  }
};

startServer();
