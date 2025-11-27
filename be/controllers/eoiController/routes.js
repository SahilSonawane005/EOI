// import express from "express";
// import controller from "./controller.js";

// const router = express.Router();

// router.post("/create", controller.createEoiDetail);
// router.get("/get",controller.getPaginatedEoi);

// export default router;

import express from "express";
import controller from "./controller.js";

const router = express.Router();
router.get("/loadform/:project_sf_id", controller.loadForm);
router.get("/projectdetails", controller.projectDetail);
router.post("/create", controller.createEoiDetail);
router.get("/get/:project_sf_id", controller.getAllEoi);
router.get("/getallclosingmgr/:project_sf_id", controller.getAllClosingMgr);
router.get("/updateEoi", controller.updateMultipleEoi);

export default router;
