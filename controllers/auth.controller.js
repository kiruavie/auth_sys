import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// inscription !!!
export const registerController = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // créer un nouvel utilisateur
    const { username, password } = req.body;

    // verifier si tous les champs sont correctement remplis
    if (!username || !password) {
      const error = new Error(
        "Tous les champs sont réquis veuillez les rempli correctement"
      );
      error.statusCode = 400;
      throw error;
    }

    // verifier si l'utilisateur existe (à partir de username)
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      const error = new Error("Le nom d'utilisateur exite déjà");
      error.statusCode = 409;
      throw error;
    }

    // hash password: hasher le mot de passe de l'utilisateur

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUsers = await User.create(
      [{ username, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign(
      { userId: newUsers[0]._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Inscription terminé avec succès",
      data: {
        user: newUsers[0],
        token,
      },
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// connexion
export const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      const error = new Error("Utilisateur introuvable");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Mot de passe incorrect");
      error.statusCode = 401;
      throw error;
    }

    // token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      success: true,
      message: "authentication terminé avec succès",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// obtenir un utilisateur
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("Utilisateur introuvable");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
