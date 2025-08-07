const express = require('express');
const router = express.Router();
const { DeliveryListForm,DeliveryListSubForm } = require('../../Models/DeliveryItem.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');



const CreateDeliveryForm = async (req, res) => {
  try {
    const {
      form_name,
      date,
      project_id,
      project_name,
      erector_name,
      panel_name,
      lop_cop,
      floor_count,
      sub_forms = []
    } = req.body;

    const newDeliveryList = new DeliveryListForm({
      project_id,
      project_name,
      erector_name,
      panel_name,
      lop_cop,
      floor_count,
      form_name,
      date,
    });
    await newDeliveryList.save();

    const uploadedFiles = req.files || [];
    const fileMap = {};

    uploadedFiles.forEach((file) => {
      const match = file.fieldname.match(/^sub_forms\[(\d+)]\[files]\[(\d+)]$/);
      if (match) {
        const formIndex = parseInt(match[1]);
        fileMap[formIndex] = fileMap[formIndex] || [];
        const fileType = file.mimetype.startsWith("video") ? "video" : "image";
        const folder = fileType === "video" ? "video" : "images";
        const fileUrl = `/public/uploads/${folder}/${file.filename}`;
        fileMap[formIndex].push({ fileType, fileUrl });
      }
    });

    const savedSubForms = await Promise.all(
      sub_forms.map(async (form, index) => {
        if (!form.form_type) {
          return null;
        }

        const newSubForm = new DeliveryListSubForm({
          type: form.form_type,
          parent_form_id: newDeliveryList._id,
          metadata: {
            items: form.form_items || []
          },
          files: fileMap[index] || []
        });

        return await newSubForm.save();
      })
    );

    return ResponseOk(res, 201, "Delivery List Form and sub-forms created successfully", {
      deliveryForm: newDeliveryList,
      subForms: savedSubForms.filter(Boolean)
    });

  } catch (error) {
    console.error("Error creating delivery list with sub-forms:", error);
    return ErrorHandler(res, 500, "Failed to create delivery list with sub-forms", error);
  }
};


const GetAllDeliveryForms = async (req, res) => {
  try {
    const forms = await DeliveryListForm.find().sort({ createdAt: -1 });
    return ResponseOk(res, 200, "All delivery list forms fetched", forms);
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch delivery list forms", error);
  }
};



const GetDeliveryFormById = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("111", id);
    const form = await DeliveryListForm.findById(id);
    if (!form) return ErrorHandler(res, 404, "Form not found");

    const subForms = await DeliveryListSubForm.find({ parent_form_id: id });

    return ResponseOk(res, 200, "Form and sub-forms fetched", { form, subForms });
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch form", error);
  }
};


const GetDeliveryFormsByProjectId = async (req, res) => {
  try {
    const { project_id } = req.query;

    const forms = await DeliveryListForm.find({ project_id }).sort({ createdAt: -1 });

    const formsWithSubForms = await Promise.all(
      forms.map(async (form) => {
        const subForms = await DeliveryListSubForm.find({ parent_form_id: form._id });
        return {
          ...form.toObject(),
          sub_forms: subForms
        };
      })
    );

    return ResponseOk(res, 200, "Forms with sub-forms fetched by project ID", formsWithSubForms);
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch forms by project", error);
  }
};



const UpdateDeliveryForm = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      project_id,
      form_name,
      date,
      project_name,
      erector_name,
      panel_name,
      lop_cop,
      floor_count,
      sub_forms = [],
      deletedImgIds = []
    } = req.body;

    const updatedForm = await DeliveryListForm.findByIdAndUpdate(
      id,
      {
        project_id,
        project_name,
        erector_name,
        panel_name,
        lop_cop,
        floor_count,
        form_name,
        date,
      },
      { new: true }
    );

    if (!updatedForm) return ErrorHandler(res, 404, "Form not found");

  

    if (deletedImgIds.length > 0) {
      console.log("deletedImgIds", deletedImgIds);

  console.log("Attempting to delete files with IDs:", deletedImgIds);
 let   UpdateddeletedImgIds = JSON.parse(deletedImgIds);

  const result = await DeliveryListSubForm.updateMany(
    { parent_form_id: id },
    { $pull: { files: { _id: { $in: UpdateddeletedImgIds } } } }
  );

  console.log("Update result:", result);
}

    const uploadedFiles = req.files || [];
    const fileMap = {};
    uploadedFiles.forEach((file) => {
      const match = file.fieldname.match(/^sub_forms\[(\d+)]\[files]\[(\d+)]$/);
      if (match) {
        const formIndex = parseInt(match[1]);
        fileMap[formIndex] = fileMap[formIndex] || [];
        const fileType = file.mimetype.startsWith("video") ? "video" : "image";
        const folder = fileType === "video" ? "video" : "images";
        const fileUrl = `/public/uploads/${folder}/${file.filename}`;
        fileMap[formIndex].push({ fileType, fileUrl });
      }
    });

   const savedSubForms = await Promise.all(
  sub_forms.map(async (form, index) => {
    if (!form.form_type) return null;

    const files = fileMap[index] || [];
    console.log("form1111",form)
    if (form._id) {
    return await DeliveryListSubForm.findByIdAndUpdate(
  form._id,
  {
    $set: {
      type: form.form_type,
      metadata: {
        items: form.form_items || []
      }
    },
    $push: {
      files: { $each: files }
    }
  },
  { new: true }
);

    } else {
      console.log("here in else")
      const newSubForm = new DeliveryListSubForm({
        type: form.form_type,
        parent_form_id: id,
        metadata: {
          items: form.form_items || []
        },
        files
      });

      return await newSubForm.save();
    }
  })
);

    return ResponseOk(res, 200, "Delivery form updated", {
      form: updatedForm,
      subForms: savedSubForms.filter(Boolean)
    });

  } catch (error) {
    console.log('error', error);
    return ErrorHandler(res, 500, "Failed to update delivery form", error);
  }
};



const DeleteDeliveryForm = async (req, res) => {
  try {
    const { id } = req.query;

    const form = await DeliveryListForm.findByIdAndDelete(id);
    if (!form) return ErrorHandler(res, 404, "Form not found");

    await DeliveryListSubForm.deleteMany({ parent_form_id: id });

    return ResponseOk(res, 200, "Form and sub-forms deleted successfully");
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to delete form", error);
  }
};



const DeliveryFormOverview = async (req,res) =>{
  try {
    const project_id = req.query.project_id;
    const forms = await DeliveryListForm.find({ project_id }).select('_id form_name date');
    return ResponseOk(res, 200, "All delivery list forms fetched", forms);
  } catch (error) {
    console.error("Error in DeliveryFormOverview:", error);
    return ErrorHandler(res, 500, "Failed to fetch delivery form overview", error);
    
  }
}





module.exports = {
    CreateDeliveryForm,
    DeleteDeliveryForm,
    UpdateDeliveryForm,
    GetAllDeliveryForms,
    GetDeliveryFormById,
    GetDeliveryFormsByProjectId,
    DeliveryFormOverview
}