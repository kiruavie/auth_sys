import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.error("❌ Aucun token fourni !");
      return res.status(401).json({ message: "Non autorisé, pas de token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé avec succès :", decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("❌ Utilisateur introuvable pour cet ID !");
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }
    req.user = user;
    console.log("✅ Utilisateur authentifié :", user);
    next();
  } catch (error) {
    console.error("🔥 Erreur d'authentification :", error.message);
    return res
      .status(401)
      .json({ message: "Non autorisé", error: error.message });
  }
};
