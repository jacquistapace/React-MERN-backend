const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese email",
      });
    }

    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      msg: "Create user",
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error. Hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrectos",
      });
    }
    
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      msg: "Login",
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error. Hable con el administrador",
    })
  }

};

const renewToken = async (req, res) => {
  const { uid, name } = req.uid;

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token
  });
};

module.exports = {
  createUser,
  login,
  renewToken,
};
