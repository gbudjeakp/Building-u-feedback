const express = require("express");
const router =  express.Router();
const auth = require("../middleware/auth")
const feedbackController = require('../Controllers/feedbackController')

router.post("/submitfeedback", auth, feedbackController.submitFeedBack);

router.post("/assignFeedBackToMentor/:feedbackrequestId", auth, feedbackController.assignFeedBackToMentor);

router.post("/addFeedBack/:feedbackrequestId", auth, feedbackController.addFeedBack);

router.get("/getfeedbackrequestForms", auth, feedbackController.getAllFeedBackRequestsForms);

router.get("/getUserFeedBackRequestForms", auth, feedbackController.getUserFeedBackRequestForms);

router.get("/getAssignedFeedBacks", auth, feedbackController.getAssignedFeedBacks);

router.get("/getMentorFeedback/:feedbackrequestId", auth,  feedbackController.getMentorFeedback);

router.get("/getfeedbackid/:feedbackrequestId", auth, feedbackController.getSelectedFeedback)

router.get("/markFeedBackRequestComplete/:feedbackrequestId", auth,  feedbackController.markFeedbackRequestComplete);

router.delete("/deleteFeedbackRequest/:feedbackrequestId", auth, feedbackController.deleteFeedbackRequest);

module.exports = router;