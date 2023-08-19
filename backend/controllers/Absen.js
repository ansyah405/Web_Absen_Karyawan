import Absen from "../models/AbsenModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import multer from "multer";
import path from "path";
import fs from "fs";

export const getAbsen = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Absen.findAll({
        attributes: ["uuid", "name", "waktu", "bukti"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Absen.findAll({
        attributes: ["uuid", "name", "waktu", "bukti"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsenId = async (req, res) => {
  try {
    const absen = await Absen.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!absen) return res.status(404).json({ msg: "Data tidak di temukan" });
    let response;
    if (req.role === "admin") {
      response = await Absen.findOne({
        attributes: ["uuid", "name", "waktu", "bukti"],
        where: {
          id: absen.id,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Absen.findOne({
        attributes: ["uuid", "name", "waktu", "bukti"],
        where: {
          [Op.and]: [{ id: absen.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAbsen = async (req, res) => {
  const { name, waktu } = req.body;
  try {
    await Absen.create({
      name: name,
      waktu: waktu,
      bukti: req.file.path,
      UserId: req.userId,
    });
    res.status(201).json({ msg: "Absen Succes" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAbsen = (req, res) => {};

export const deleteAbsen = (req, res) => {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./bukti");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: "5000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimtype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimtype && extname) {
      return cb(null, true);
    }
    cb("Give Proper");
  },
}).single("bukti");
