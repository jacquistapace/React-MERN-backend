const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;

    await event.save();
    res.json({
      ok: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al crear el evento",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No autorizado para actualizar el evento seleccionado",
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      newEvent,
      { new: true }
    );

    res.json({  ok: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el evento",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const { id } = req.params;

  try {
      
      const userId = req.uid;
      
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({
          ok: false,
          msg: "Evento no encontrado",
        });
      }

      if (event.user.toString() !== userId) {
        return res.status(401).json({
          ok: false,
          msg: "No autorizado para eliminar el evento seleccionado",
        });
      }

      const deletionResult = await Event.findByIdAndDelete(id);
    
      if (!deletionResult) {
        return res.status(404).json({
          ok: false,
          msg: "Evento no encontrado",
        });
      }
    
      res.json({
        ok: true,
        msg: "Evento eliminado correctamente",
        event: deletionResult
      });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al eliminar el evento",
    })
  }

};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
