const express = require('express');
const router = express.Router();
const { Elevators } = require('../../Models/Project.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const { ActivityLog } = require('../../Models/Activitylog.model');
const { Project } = require('../../Models/Project.model'); // Assuming you have a Project model

const CreateElevator = async (req, res) => {
    try {
        const {
            project_id,
            elevator_name,
            type_of_elevator,
            operation_type,
            passenger_capacity,
            speed,
            no_of_floors,
            stops,
            opening_type,
            lift_well_width,
            lift_well_depth,
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

        const project = await Project.findById(project_id).select('site_name');
        const site_name = project ? project.site_name : 'Unknown Project';

        const newElevator = new Elevators({
            project_id,
            elevator_name,
            type_of_elevator,
            operation_type,
            passenger_capacity,
            speed,
            no_of_floors,
            stops,
            opening_type,
            lift_well_width,
            lift_well_depth,
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


        await ActivityLog.create({
            user_id: req.user?._id || null,
            action: 'CREATE_ELEVATOR',
            type: 'Message_Response',
            sub_type: 'Create',
            message: `Elevator "${elevator_name}" was created under project "${site_name}".`,
            title: 'Elevator Created',
            created_by: req.user?._id || null
        });


        return ResponseOk(res, 201, "Elevator created successfully", savedElevator);
    } catch (error) {
        console.error("Error creating elevator:", error);
        return ErrorHandler(res, 500, "Failed to create elevator", error);
    }
};

const UpdateElevator = async (req, res) => {
    try {
        const elevatorId = req.query.id;
        const updateData = req.body;
        console.log("Update Data:", updateData);

        const updatedElevator = await Elevators.findByIdAndUpdate(
            elevatorId,
            updateData,
            { new: true }
        );

        if (!updatedElevator) {
            return ErrorHandler(res, 404, "Elevator not found");
        }
        const projectData = await Project.findById(updatedElevator.project_id).select('site_name');
        const site_name = projectData ? projectData.site_name : 'Unknown Project';

        await ActivityLog.create({
            user_id: req.user?._id || null,
            action: 'UPDATE_ELEVATOR',
            type: 'Message_Response',
            sub_type: 'Update',
            message: `Elevator "${updatedElevator.elevator_name}" was updated under project "${site_name}".`,
            title: 'Elevator Updated',
            created_by: req.user?._id || null
        });

        return ResponseOk(res, 200, "Elevator updated successfully", updatedElevator);
    } catch (error) {
        console.error("Error updating elevator:", error);
        return ErrorHandler(res, 500, "Failed to update elevator", error);
    }

};

const GetElevatorById = async (req, res) => {
    try {
        const elevatorId = req.query.id;
        const elevator = await Elevators.findById(elevatorId);

        if (!elevator) {
            return ErrorHandler(res, 404, "Elevator not found");
        }

        return ResponseOk(res, 200, "Elevator retrieved successfully", elevator);
    } catch (error) {
        console.error("Error retrieving elevator:", error);
        return ErrorHandler(res, 500, "Failed to retrieve elevator", error);
    }
}

const DeleteElevator = async (req, res) => {
  try {
    const elevatorId = req.query.id;

    const elevatorToDelete = await Elevators.findById(elevatorId);

    if (!elevatorToDelete) {
      return ErrorHandler(res, 404, "Elevator not found");
    }

    const projectData = await Project.findById(elevatorToDelete.project_id).select('site_name');
    const site_name = projectData ? projectData.site_name : 'Unknown Project';

    const deletedElevator = await Elevators.findByIdAndDelete(elevatorId);

    // Log the delete action
    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'DELETE_ELEVATOR',
      type: 'Message_Response',
      sub_type: 'Delete',
      message: `Elevator "${elevatorToDelete.elevator_name}" was deleted from project "${site_name}".`,
      title: 'Elevator Deleted',
      created_by: req.user?._id || null
    });

    return ResponseOk(res, 200, "Elevator deleted successfully", deletedElevator);
  } catch (error) {
    console.error("Error deleting elevator:", error);
    return ErrorHandler(res, 500, "Failed to delete elevator", error);
  }
};


const GetElevatorByProjectId = async (req, res) => {
    try {
        const projectId = req.query.project_id;
        const elevator = await Elevators.find({ project_id: projectId })
            .select("_id project_id elevator_name type_of_elevator operation_type passenger_capacity no_of_floors stops speed");
        if (!elevator) {
            return ErrorHandler(res, 404, "Elevator not found");
        }

        return ResponseOk(res, 200, "Elevator retrieved successfully", elevator);
    } catch (error) {
        console.error("Error retrieving elevator:", error);
        return ErrorHandler(res, 500, "Failed to retrieve elevator", error);
    }
}

module.exports = {
    CreateElevator,
    UpdateElevator,
    GetElevatorById,
    DeleteElevator,
    GetElevatorByProjectId
};

