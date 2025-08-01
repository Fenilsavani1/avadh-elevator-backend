const {Erector} = require('../../Models/Erector.model');
const { InstallationTerms, PaymentRecord } = require('../../Models/Erector.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler'); 

const CreateErector = async (req, res) => {
  try {
    const newErector = new Erector(req.body);
    const savedErector = await newErector.save();
    return ResponseOk(res, 201, 'Erector created successfully', savedErector);
  } catch (error) {
    return ErrorHandler(res, 500, 'Failed to create erector', error);
  }
};

const CreateInstallationTerms = async (req, res) => {
  try {
    const newTerms = new InstallationTerms(req.body);
    const savedTerms = await newTerms.save();
    return ResponseOk(res, 201, 'Installation terms saved successfully', savedTerms);
  } catch (error) {
    return ErrorHandler(res, 500, 'Failed to create installation terms', error);
  }
};

const CreatePaymentRecord = async (req, res) => {
  try {
    const newPayment = new PaymentRecord(req.body);
    const savedPayment = await newPayment.save();
    return ResponseOk(res, 201, 'Payment record created successfully', savedPayment);
  } catch (error) {
    return ErrorHandler(res, 500, 'Failed to create payment record', error);
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


module.exports = {
  CreateErector,
  CreateInstallationTerms,
  CreatePaymentRecord,
  GetAllErectors
};



