const { Router } = require("express");
const Routes = Router();
const AuthRouter = require('./Auth/AuthRoutes');
const ErectorRouter = require("./Erector/ErectorRoutes");
const FormRouter = require("./HandOverForm/HandOverFormRoutes");
const PaymentRouter = require("./Payment/PaymentRoutes");
const ProjectRouter = require("./Project/ProjectRoutes");
const QcRouter = require("./QC/QcRoutes");
const AdminRouter = require("./Admin/AdminRoutes");
const VendorRouter = require("./Vendor/VendorRoutes");
const ElevatorRouter = require("./Elevator/ElevatorRoutes");
const PreInstallRouter = require("./PreInstall/PreInstallRoutes");

Routes.use("/auth", AuthRouter);
Routes.use("/erector",ErectorRouter)
Routes.use('/form',FormRouter)
Routes.use('/payment',PaymentRouter)
Routes.use('/project',ProjectRouter)
Routes.use('/qc',QcRouter)
Routes.use('/admin',AdminRouter)
Routes.use('/vendor',VendorRouter)
Routes.use('/elevator', ElevatorRouter);
Routes.use('/pre_install', PreInstallRouter);

module.exports = Routes;