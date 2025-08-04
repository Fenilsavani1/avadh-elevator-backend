const { Router } = require("express");

const {CreateElevator, UpdateElevator, GetElevatorById, DeleteElevator, GetElevatorByProjectId } = require('../../Controllers/Elevator/Elevator.Controller');


const ElevatorRouter = Router();

ElevatorRouter.post('/create_elevator', CreateElevator);
ElevatorRouter.put('/update_elevator', UpdateElevator);
ElevatorRouter.get('/get_elevator', GetElevatorById);
ElevatorRouter.post('/delete_elevator', DeleteElevator);
ElevatorRouter.get('/get_elevator_by_project_id', GetElevatorByProjectId);



module.exports = ElevatorRouter;