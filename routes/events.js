const { Router } = require("express");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validator");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(jwtValidator);

router.get("/", [jwtValidator], getEvents);

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate),
    check("end", "La fecha de fin es obligatoria").custom(isDate),
    validateFields
  ],
  createEvent
);

router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("startDate", "La fecha de inicio es obligatoria").not().isEmpty(),
    check("endDate", "La fecha de finalización es obligatoria")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error(
            "La fecha de finalización debe ser mayor que la fecha de inicio"
          );
        }
        return true;
      }),
  ],
  updateEvent
);

router.delete("/:id", deleteEvent);

module.exports = router;
