const { HandOverForm } = require('../../Models/HandOverForm.model'); 
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler'); 

const createHandOverForm = async (req, res) => {
  try {
    const {
      siteSupervisor,
      date,
      jobNumber,
      sideName,
      wingLiftNumber,
      siteHandler,
      erectorName,
      wireManName,
    } = req.body;

    // Check required fields
    if (!siteSupervisor || !date || !jobNumber) {
      return ErrorHandler(res, 400, "siteSupervisor, date, and jobNumber are required");
    }

    const newForm = await HandOverForm.create({
      siteSupervisor,
      date,
      jobNumber,
      sideName,
      wingLiftNumber,
      siteHandler,
      erectorName,
      wireManName,
    });

    return ResponseOk(res, 201, "HandOver form created successfully", newForm);
  } catch (error) {
    console.error("[createHandOverForm]", error);
    return ErrorHandler(res, 500, "Server error while creating HandOver form");
  }
};

module.exports = { createHandOverForm };

