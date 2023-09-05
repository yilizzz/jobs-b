const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jobsCtrl = require("../controllers/jobs");

router.get("/:userId", jobsCtrl.getAllJobs);
router.post("/", auth, jobsCtrl.createJob);
router.put("/:id", auth, jobsCtrl.modifyJob);
router.delete("/:id", auth, jobsCtrl.deleteJob);

router.get("/search/:userId/:keywords", jobsCtrl.searchJobs);

module.exports = router;
