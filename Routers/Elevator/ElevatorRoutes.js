const { Router } = require("express");

const {CreateElevator, UpdateElevator, GetElevatorById, DeleteElevator } = require('../../Controllers/Elevator/Elevator.Controller');


const ElevatorRouter = Router();

ElevatorRouter.post('/create_elevator', CreateElevator);
ElevatorRouter.put('/update_elevator', UpdateElevator);
ElevatorRouter.get('/get_elevator', GetElevatorById);
ElevatorRouter.post('/delete_elevator', DeleteElevator);



module.exports = ElevatorRouter;