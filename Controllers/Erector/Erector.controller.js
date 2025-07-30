const {Erector} = require('../../Models/Erector.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler'); 

const createErector = async (req, res) => {
  try {
    const { erectorName, date, mobileNo, aadharNumber } = req.body;

    if (!erectorName || !date || !mobileNo || !aadharNumber) {
      return ErrorHandler(res, 400, "All fields are required");
    }

    const exists = await Erector.findOne({ aadharNumber });
if (exists) {
  return ErrorHandler(res, 400, "Erector already exists with this Aadhar number");
}

    const newErector = await Erector.create({
      erectorName,
      date,
      mobileNo,
      aadharNumber,
    });

    return ResponseOk(res, 201, "Erector created successfully", newErector);
  } catch (err) {
    console.error("[createErector]", err);
    return ErrorHandler(res, 500, "Server error while creating Erector");
  }
};

module.exports = { createErector };

