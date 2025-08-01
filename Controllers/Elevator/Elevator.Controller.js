const express = require('express');
const router = express.Router();
const {Elevators} = require('../../Models/Project.model');
const {ResponseOk, ErrorHandler} = require('../../Utils/ResponseHandler');

const CreateElevator = async (req, res) => {
  try {
    const {
      project_id,
      type_of_elevator,
      operation_type,
      passenger_capacity,
      speed,
      no_of_floors,
      stops,
      opening_type,
      lift_well_width,
      car_enclouser_type,
      car_flooring_type,
      car_door_type,
      landing_door_type,
      clear_opening_height,
      clear_opening_width,
      false_ceiling,
      ms_door_frames,
      ard_system,
      overload_sensor,
      telephone,
      fan_blower,
      lop_cop,
      notes,
    } = req.body;

    const newElevator = new Elevators({
      project_id,
      type_of_elevator,
      operation_type,
      passenger_capacity,
      speed,
      no_of_floors,
      stops,
      opening_type,
      lift_well_width,
      car_enclouser_type,
      car_flooring_type,
      car_door_type,
      landing_door_type,
      clear_opening_height,
      clear_opening_width,
      false_ceiling,
      ms_door_frames,
      ard_system,
      overload_sensor,
      telephone,
      fan_blower,
      lop_cop,
      notes,
    });

    const savedElevator = await newElevator.save();

    return ResponseOk(res, 201, "Elevator created successfully", savedElevator);
  } catch (error) {
    console.error("Error creating elevator:", error);
    return ErrorHandler(res, 500, "Failed to create elevator", error);
  }
};

const UpdateElevator = async (req, res) => {
  try {
    const elevatorId  = req.query.elevatorId;
    const updateData = req.body;
    console.log("Update Data:", updateData);
    const updatedElevator = await Elevators.findByIdAndUpdate(
      elevatorId,
      updateData,
      { new: true }
    );
    console.log("Updated Elevator:", updatedElevator)
    if (!updatedElevator) {
      return ErrorHandler(res, 404, "Elevator not found");
    }
    return ResponseOk(res, 200, "Elevator updated successfully", updatedElevator);
  } catch (error) {
    console.error("Error updating elevator:", error);
    return ErrorHandler(res, 500, "Failed to update elevator", error);
  }

};


module.exports = {
  CreateElevator,
  UpdateElevator
};

