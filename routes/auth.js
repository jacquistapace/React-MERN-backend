const { Router } = require("express");
const { check } = require("express-validator");

const { createUser, login, renewToken } = require("../controllers/auth");
const { validateFields } = require("../middlewares/field-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");

const router = Router();

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check(
      "password",
      "El password debe contener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    validateFields
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    check(
      "password",
      "El password debe contener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    validateFields
  ],
  login
);

router.get("/renew", jwtValidator, renewToken);

module.exports = router;
