const { Router } = require("express");

const {CreateElevator, UpdateElevator } = require('../../Controllers/Elevator/Elevator.Controller');


const ElevatorRouter = Router();

ElevatorRouter.post('/create_elevator', CreateElevator);
ElevatorRouter.put('/update_elevator', UpdateElevator);



module.exports = ElevatorRouter;