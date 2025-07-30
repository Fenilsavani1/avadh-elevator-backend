const { Router } = require("express");

const { Project } = require('../../Models/Project.model')
const { createProject, ViewProject, UpdateProject } = require("../../Controllers/Project/Project.Controller");


const ProjectRouter = Router();

ProjectRouter.post('/add_project', createProject);
ProjectRouter.get('/view_project', ViewProject);
ProjectRouter.put('/update_project', UpdateProject);




module.exports = ProjectRouter;