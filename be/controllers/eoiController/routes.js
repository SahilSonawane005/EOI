// import express from "express";
// import controller from "./controller.js";

// const router = express.Router();

// router.post("/create", controller.createEoiDetail);
// router.get("/get",controller.getPaginatedEoi);

// export default router;

import express from "express";
import controller from "./controller.js";

const router = express.Router();

router.post("/create", controller.createEoiDetail);
router.get("/get", controller.getAllEoi);

export default router;
