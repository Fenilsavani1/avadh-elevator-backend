const { Erector } = require('../../Models/Erector.model');
const { InstallationTerms, PaymentRecord } = require('../../Models/Erector.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const { ActivityLog } = require('../../Models/Activitylog.model');

const CreateErector = async (req, res) => {
  try {
    const newErector = new Erector(req.body);
    const savedErector = await newErector.save();


    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'CREATE_ERECTOR',
      type: 'Message_Response',
      sub_type: 'Create',
      message: `Erector "${savedErector.erector_name || savedErector._id}" was created.`,
      title: 'Erector Created',
      created_by: req.user?._id || null
    });

    return ResponseOk(res, 201, 'Erector created successfully', savedErector);
  } catch (error) {
    console.log("erroer", error);
    return ErrorHandler(res, 500, 'Failed to create erector', error);
  }
};

const GetAllErectors = async (req, res) => {
  try {
    // Fetch all erectors with their linked project
    const erectors = await Erector.find().populate('project_id').lean();

    // Fetch all installation terms and payment records
    const allTerms = await InstallationTerms.find().lean();
    const allPayments = await PaymentRecord.find().lean();

    // Merge related data into each erector
    const enrichedErectors = erectors.map((erector) => {
      const terms = allTerms.filter(term => term.erector_id.toString() === erector._id.toString());
      const payments = allPayments.filter(pay => pay.erector_id.toString() === erector._id.toString());

      return {
        ...erector,
        installation_terms: terms,
        payment_records: payments
      };
    });

    return ResponseOk(res, 200, 'All erectors with terms and payments fetched successfully', enrichedErectors);
  } catch (error) {
    return ErrorHandler(res, 500, 'Failed to fetch erector data', error);
  }
};

const DeleteErector = async (req, res) => {
  try {
    const id = req.query.id;
    const deletedErector = await Erector.findByIdAndDelete(id);

    if (!deletedErector) {
      return ErrorHandler(res, 404, 'Erector not found');
    }

    // Optionally delete related installation terms and payment records
    await InstallationTerms.deleteMany({ erector_id: id });
    await PaymentRecord.deleteMany({ erector_id: id });

    return ResponseOk(res, 200, 'Erector deleted successfully');
  } catch (error) {
    return ErrorHandler(res, 500, 'Failed to delete erector', error);
  }
};


module.exports = {
  CreateErector,
  GetAllErectors,
  DeleteErector
};



