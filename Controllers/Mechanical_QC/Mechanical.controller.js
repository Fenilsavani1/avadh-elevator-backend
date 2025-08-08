const { MeachanicalQc,MeachanicalQcForm } = require("../../Models/QC.model");
const { ResponseOk, ErrorHandler } = require("../../Utils/ResponseHandler");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');


const CreateMechanicalQC = async (req, res) => {
  try {
    const {
      contract_name,
      site_name,
      project_id,
      date,
      mobile_number,
      supervisor_name,
      area,
      block,
      machine_make,
      machine_hp,
      machine_sr_no,
      drive_make,
      drive_hp,
      drive_sr_no,
      lift_floor,
      lift_capacity,
      lift_type,
      subform = []
    } = req.body;

    const newMechanicalQC = new MeachanicalQc({
      contract_name,
      site_name,
      project_id,
      date,
      mobile_number,
      supervisor_name,
      area,
      block,
      machine_make,
      machine_hp,
      machine_sr_no,
      drive_make,
      drive_hp,
      drive_sr_no,
      lift_floor,
      lift_capacity,
      lift_type
    });

    await newMechanicalQC.save();
    console.log("req.files",req.files)
    const uploadedFiles = req.files || [];
    const fileMap = {};

   uploadedFiles.forEach((file) => {
  const match = file.fieldname.match(/^subform\[(\d+)]\[files]$/);
  if (match) {
    const formIndex = parseInt(match[1], 10);
    fileMap[formIndex] = fileMap[formIndex] || [];

    const fileType = file.mimetype.startsWith("video") ? "video" : "image";
    const folder = fileType === "video" ? "video" : "images";
    const fileUrl = `/public/uploads/${folder}/${file.filename}`;

    fileMap[formIndex].push({ fileType, fileUrl });
  }
});


    const savedSubForms = await Promise.all(
      subform.map(async (form, index) => {
          console.log("jjjj",form)
        if (!form.form_type || !form.form_no ) {
          return null;
        }
        console.log("newMechanicalQC",newMechanicalQC)
        const newSubForm = new MeachanicalQcForm({
          parent_form_id: newMechanicalQC._id,
          form_type: form.form_type,
          form_no: form.form_no,
          sub_form_no: form.sub_form_no,
        //   qc_checklist_no: form.qc_checklist_no,
          form_data: {
            point_no: form.point_no,
            sub_point_no: form.sub_point_no,
            type: form.form_type,
            data: form.data || []
          },
          files: fileMap[index] || []
        });

        return await newSubForm.save();
      })
    );

    return res.status(201).json({
      message: "Mechanical QC created successfully",
      mechanicalForm: newMechanicalQC,
      subForms: savedSubForms.filter(Boolean)
    });

  } catch (error) {
    console.error("Error creating mechanical_qc with sub-forms:", error);
    return res.status(500).json({
      message: "Failed to create mechanical_qc with sub-forms",
      error: error.message
    });
  }
};

const UpdateMechanicalQC = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return ErrorHandler(res, 400, "ID is required to update mechanical_qc");
    }
    const {
      contract_name,
      site_name,
      project_id,
      date,
      mobile_number,
      supervisor_name,
      area,
      block,
      machine_make,
      machine_hp,
      machine_sr_no,
      drive_make,
      drive_hp,
      drive_sr_no,
      lift_floor,
      lift_capacity,
      lift_type,
      subform = [],
      deleteImgIds = [] 
    } = req.body;

    const mechanicalQC = await MeachanicalQc.findById(id);
    if (!mechanicalQC) {
      return res.status(404).json({ message: "Mechanical QC not found" });
    }

    Object.assign(mechanicalQC, {
      contract_name,
      site_name,
      project_id,
      date,
      mobile_number,
      supervisor_name,
      area,
      block,
      machine_make,
      machine_hp,
      machine_sr_no,
      drive_make,
      drive_hp,
      drive_sr_no,
      lift_floor,
      lift_capacity,
      lift_type
    });

    await mechanicalQC.save();

    const uploadedFiles = req.files || [];
    const fileMap = {};

    uploadedFiles.forEach((file) => {
      const match = file.fieldname.match(/^subform\[(\d+)]\[files]$/);
      if (match) {
        const formIndex = parseInt(match[1], 10);
        fileMap[formIndex] = fileMap[formIndex] || [];

        const fileType = file.mimetype.startsWith("video") ? "video" : "image";
        const folder = fileType === "video" ? "video" : "images";
        const fileUrl = `/public/uploads/${folder}/${file.filename}`;

        fileMap[formIndex].push({ fileType, fileUrl });
      }
    });
     console.log("here fileMap", deleteImgIds)
     console.log("Array.isArray(deleteImgIds)", Array.isArray(deleteImgIds))
     console.log("deleteImgIds.length", deleteImgIds.length)
    if ( deleteImgIds.length > 0) {
      console.log("objects", deleteImgIds)
      // const updatedDeletedImg = JSON.parse(deleteImgIds)

       let deleteImgIdss = JSON.parse(deleteImgIds);
      await MeachanicalQcForm.updateMany(
        { parent_form_id: id },
        { $pull: { files: { _id: { $in: deleteImgIdss } } } }
      );
    }

    const savedSubForms = await Promise.all(
      subform.map(async (form, index) => {
        if (!form.form_type || !form.form_no) {
          return null;
        }

        if (form._id) {
          const existingForm = await MeachanicalQcForm.findById(form._id);
          if (existingForm) {
            existingForm.form_type = form.form_type;
            existingForm.form_no = form.form_no;
            existingForm.sub_form_no = form.sub_form_no;
            existingForm.form_data = {
              point_no: form.point_no,
              sub_point_no: form.sub_point_no,
              type: form.form_type,
              data: form.data || []
            };
            if (fileMap[index]) {
              existingForm.files.push(...fileMap[index]);
            }
            return await existingForm.save();
          }
        } else {
          const newSubForm = new MeachanicalQcForm({
            parent_form_id: mechanicalQC._id,
            form_type: form.form_type,
            form_no: form.form_no,
            sub_form_no: form.sub_form_no,
            form_data: {
              point_no: form.point_no,
              sub_point_no: form.sub_point_no,
              type: form.form_type,
              data: form.data || []
            },
            files: fileMap[index] || []
          });
          return await newSubForm.save();
        }
      })
    );

    return res.status(200).json({
      message: "Mechanical QC updated successfully",
      mechanicalForm: mechanicalQC,
      subForms: savedSubForms.filter(Boolean)
    });

  } catch (error) {
    console.error("Error updating mechanical_qc:", error);
    return res.status(500).json({
      message: "Failed to update mechanical_qc",
      error: error.message
    });
  }
};


const GetMechanicalQCByID = async (req,res) =>{
  try {
      const { id } = req.query;
      if (!id) {
        return ErrorHandler(res, 400, "ID is required to fetch mechanical_qc");
      }
      const mechanical_qc = await MeachanicalQc.aggregate([
        {
    $match: {
      _id: new mongoose.Types.ObjectId(id) 
    }
  },
        {
          $lookup: {
            from: "meachanical_qc_forms",
            localField: "_id",
            foreignField: "parent_form_id",
            as: "sub_forms"
          }
        },
      ])

    return ResponseOk(res, 200, "Mechanical QC fetched successfully", mechanical_qc);
  } catch (error) {
    console.error("Error fetching mechanical_qc:", error);
   return ErrorHandler(res, 500, "Failed to fetch mechanical_qc", error.message);
    
  }
}


const GetMechanicalQCAll = async (req,res) =>{
  try {
    const mechanical_qc = await MeachanicalQc.find().select("_id contract_name site_name project_id date mobile_number supervisor_name area block machine_make");
    return ResponseOk(res, 200, "All Mechanical QCs fetched successfully", mechanical_qc);
  } catch (error) {
    console.error("Error fetching all mechanical_qc:", error);
    return ErrorHandler(res, 500, "Failed to fetch all mechanical_qc", error.message);
    
  }
}


const GetMechanicalQCOveriview = async (req,res) =>{
  try {
     const mechanical_qc = await MeachanicalQc.find().select("_id contract_name site_name project_id date mobile_number supervisor_name area createdAt");
    return ResponseOk(res, 200, "All Mechanical QCs fetched successfully", mechanical_qc);
  } catch (error) {
    console.error("Error fetching mechanical_qc overview:", error);
    return ErrorHandler(res, 500, "Failed to fetch mechanical_qc overview", error.message);
    
  }
}
module.exports = {
    CreateMechanicalQC,
    UpdateMechanicalQC,
    GetMechanicalQCByID,
    GetMechanicalQCAll,
    GetMechanicalQCOveriview
}