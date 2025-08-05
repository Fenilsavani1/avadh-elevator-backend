const { Erector } = require('../../Models/Erector.model');
const { InstallationTerms, PaymentRecord } = require('../../Models/Erector.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');

const CreateErector = async (req, res) => {
  try {
    const { erectorData, installation_data, payment_record } = req.body;

    const newErector = new Erector(erectorData);
    const savedErector = await newErector.save();
    const erector_id = savedErector._id;

    let savedInstallationTerms = null;
    if (installation_data) {
      const installationPayload = {
        ...installation_data,
        erector_id,
      };
      const newInstallation = new InstallationTerms(installationPayload);
      savedInstallationTerms = await newInstallation.save();
    }

    let savedPaymentRecords = [];
    if (Array.isArray(payment_record) && payment_record.length > 0) {
      const paymentPayloads = payment_record.map(record => ({
        ...record,
        erector_id,
      }));
      savedPaymentRecords = await PaymentRecord.insertMany(paymentPayloads);
    }

    return ResponseOk(res, 201, "Erector created successfully", {
      erector: savedErector,
      installation_terms: savedInstallationTerms,
      payment_records: savedPaymentRecords,
    });
  } catch (error) {
    console.error("[CreateErector]", error);
    return ErrorHandler(res, 500, "Failed to create erector", error);
  }
};

const UpdateErector = async (req, res) => {
  try {
    const { id: erector_id } = req.query;
    const { erectorData, installation_data, payment_record } = req.body;

    const updatedErector = await Erector.findByIdAndUpdate(
      erector_id,
      erectorData,
      { new: true }
    );

    if (!updatedErector) {
      return ErrorHandler(res, 404, "Erector not found");
    }

    let updatedInstallationTerms = null;
    if (installation_data) {
      updatedInstallationTerms = await InstallationTerms.findOneAndUpdate(
        { erector_id },
        { ...installation_data, erector_id },
        { upsert: true, new: true }
      );
    }

    let updatedPaymentRecords = [];
    if (Array.isArray(payment_record)) {
      await PaymentRecord.deleteMany({ erector_id });

      const newPayments = payment_record.map(record => ({
        ...record,
        erector_id,
      }));
      updatedPaymentRecords = await PaymentRecord.insertMany(newPayments);
    }

    return ResponseOk(res, 200, "Erector updated successfully", {
      erector: updatedErector,
      installation_terms: updatedInstallationTerms,
      payment_records: updatedPaymentRecords,
    });
  } catch (error) {
    console.error("[updateErector]", error);
    return ErrorHandler(res, 500, "Failed to update erector", error);
  }
};

const GetAllErectors = async (req, res) => {
  try {
    const erectors = await Erector.find({project_id: req.query.project_id}).lean();

    const allTerms = await InstallationTerms.find().lean();
    const allPayments = await PaymentRecord.find().lean();

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

const GetErectorsById = async (req, res) => {
  try {
    const erectors = await Erector.findById(req.query.id);

    const allTerms = await InstallationTerms.find({ erector_id: erectors._id });
    const allPayments = await PaymentRecord.find({ erector_id: erectors._id });

  
    const updatedData = {
      erector: erectors,
      installation_terms: allTerms,
      payment_records: allPayments
    }

    return ResponseOk(res, 200, 'Erectors with terms and payments fetched successfully', updatedData);
  } catch (error) {
    console.log('error', error);
    return ErrorHandler(res, 500, 'Failed to fetch erector data', error);
  }
};

const GetErectorsOverview = async (req, res) => {
   try {
    const erectors = await Erector.find({project_id: req.query.project_id}).select('_id erector_name mobile_no date total_lift types_lift location').lean();

    // const allTerms = await InstallationTerms.find();
    // const allPayments = await PaymentRecord.find();

    const enrichedErectors = erectors.map((erector) => {
      // const terms = allTerms.filter(term => term.erector_id.toString() === erector._id.toString());
      // const payments = allPayments.filter(pay => pay.erector_id.toString() === erector._id.toString());

      return {
        ...erector
        // installation_terms: terms,
        // payment_records: payments
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
  UpdateErector,
  GetAllErectors,
  DeleteErector,
  GetErectorsById,
  GetErectorsOverview
};

