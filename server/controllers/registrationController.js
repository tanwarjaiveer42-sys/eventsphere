const Registration = require("../models/Registration");

exports.registerEvent = async (req, res) => {
  try {
    const registration = await Registration.create({
      userId: req.user.id,
      eventId: req.params.eventId,
    });

    res.status(201).json({
      message: "Registered Successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};