require("dotenv").config();
const db = require("../Models/index");
const { Op } = require("sequelize");
const FeedbackRequest = db.FeedbackRequest;
const Feedbacks = db.Feedbacks;
const User = db.User;
const jwt = require("jsonwebtoken");

/*This controller allows the interns to request for feedback using the request
feedback forms.
 */

const submitFeedBack = async (req, res) => {
  const { authToken } = req.cookies;
  const { id, username } = jwt.verify(authToken, process.env.JWT_SECRET);
  try {
    const { topicOfLearningSession, codeLink } = req.body;
    const feedBackRequestData = {
      userId: id,
      studentName: username,
      topicOfLearningSession: topicOfLearningSession,
      codeLink: codeLink,
    };

    await FeedbackRequest.create(feedBackRequestData);
    res.status(200).json(JSON.stringify(feedBackRequestData));
    console.log("FeedBack Request Submitted");
  } catch (err) {
    console.error(err);
  }
};

/*This retrieves every single feedback (only requests that are not marked as complete requests made by the interns
 */
const getAllFeedBackRequestsForms = async (req, res) => {
  const { authToken } = req.cookies;
  const { id, username } = jwt.verify(authToken, process.env.JWT_SECRET);
  try {
    const isMentor = await User.findOne({
      where: {
        id: id,
        mentor: true,
      },
    });
    if (isMentor) {
      const feedBackrequests = await FeedbackRequest.findAll({
        where: {
          status: {
            [Op.not]: true,
          },
        },
      });
      res.status(200).json({ data: feedBackrequests });
    }
    if (!isMentor) {
      const feedBackrequests = await FeedbackRequest.findAll({
        where: {
          studentName: username,
          status: {
            [Op.not]: true,
          },
        },
      });
      res.status(200).json({ data: feedBackrequests });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*This Gets all the intern feedback request forms for the intern 
that is logged in */
const getUserFeedBackRequestForms = async (req, res) => {
  try {
    const { authToken } = req.cookies;
    const { id } = jwt.verify(authToken, process.env.JWT_SECRET);
    let singleFeedBack = await FeedbackRequest.findAll({
      where: { userId: id },
    });
    res.status(200).json({ data: singleFeedBack });
  } catch (err) {
    console.error(err);
  }
};

/*This controller gets all the feedback from a code lead on specific  feedback request forms for the logged in Intern
 */
const getMentorFeedback = async (req, res) => {
  try {
    const { feedbackrequestId } = req.params;

    // Find the feedback request
    const feedbackRequest = await FeedbackRequest.findOne({
      where: { id: feedbackrequestId },
    });

    if (!feedbackRequest) {
      return res.status(404).json({ error: "Feedback request not found" });
    }

    // Retrieve all feedback associated with the feedback request
    const allFeedbackOnFeedbackRequest = await Feedbacks.findAll({
      where: { feedbackrequestId },
    });

    res.json({ data: allFeedbackOnFeedbackRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


/*This controller allows interns to delete selected  feedback request*/
const deleteFeedbackRequest = async (req, res)=>{

}




//////////////////////////////////////////
/* Code below here are basically controller functions 
for the Code leads or mentor endpoints 
*/
///////////////////////////////////////////////

/*This controller allows the Code leads to add feedbacks to the feedback requests made 
by the interns */
const addFeedBack = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { feedbackrequestId } = req.params;
    const { authToken } = req.cookies;
    const { id, username } = jwt.verify(authToken, process.env.JWT_SECRET);

    // Check if the user is a mentor
    const isMentor = await User.findOne({
      where: {
        id: id,
        mentor: true,
      },
    });

    if (!isMentor) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    // Find the specific feedback request record based on feedbackrequestId
    const feedbackRequest = await FeedbackRequest.findOne({
      where: { id: feedbackrequestId },
    });

    if (!feedbackRequest) {
      return res.status(404).json({ msg: "Feedback request not found" });
    }

    // Create the feedback and associate it with the feedback request and mentor
    const feedBackData = {
      userId: feedbackRequest.userId,
      mentorName: username,
      feedback: feedback,
      feedbackRequestId: feedbackRequest.id,
    };

    const createdFeedback = await Feedbacks.create(feedBackData);

    res.status(200).json({
      msg: "Feedback added successfully",
      data: createdFeedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred adding feedback" });
  }
};

/*This controller allows the Code leads to assign feedback requests to themselves
 */
const assignFeedBackToMentor = async (req, res) => {
  try {
    const { feedbackrequestId } = req.params;
    const { authToken } = req.cookies;
    const { id, username } = jwt.verify(authToken, process.env.JWT_SECRET);

    // Check if the user is a mentor
    const isMentor = await User.findOne({
      where: {
        id: id,
        mentor: true,
      },
    });

    if (!isMentor) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    // Find the specific feedback request record based on feedbackrequestId
    const feedbackRecord = await FeedbackRequest.findOne({
      where: { id: feedbackrequestId },
    });

    if (!feedbackRecord) {
      return res.status(404).json({ msg: "Feedback record not found" });
    }

    if (feedbackRecord.isAssigned) {
      return res.json({ msg: "Feedback is already assigned to another" });
    }

    feedbackRecord.isAssigned = true;
    feedbackRecord.whoisAssigned = username;
    await feedbackRecord.save();
    res.json({ msg: "Feedback Assigned to mentor" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating feedback" });
  }
};

/*This controller retrieves all the assigned Feedback Requests
of the code lead logged in.
 */
const getAssignedFeedBacks = async (req, res) => {
  try {
    const { authToken } = req.cookies;
    const { id, username } = jwt.verify(authToken, process.env.JWT_SECRET);

    // Check if the user is a mentor
    const isMentor = await User.findOne({
      where: {
        id: id,
        mentor: true,
      },
    });

    if (!isMentor) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    let assignedList = await FeedbackRequest.findAll({
      where: {
        whoisAssigned: username,
        status: {
          [Op.not]: true,
        },
      },
    });
    res.status(200).json({ data: assignedList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*This controller fetches a specific request id */
const getSelectedFeedback = async (req, res) => {
  try {
    const { feedbackrequestId } = req.params;

    // Find the specific feedback request record based on feedbackrequestId
    const feedbackRequest = await FeedbackRequest.findOne({
      where: { id: feedbackrequestId },
    });

    if (!feedbackRequest) {
      return res.status(404).json({ msg: "Feedback request not found" });
    }

    res.json({ data: feedbackRequest });
  } catch (error) {
    console.error(error);
    // Handle different types of errors and send an appropriate response
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ msg: "Invalid authentication token" });
    } else {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

const markFeedbackRequestComplete = async (req, res) => {
  try {
    const { feedbackrequestId } = req.params;
    const { authToken } = req.cookies;
    const { id } = jwt.verify(authToken, process.env.JWT_SECRET);

    // Check if the user is a mentor
    const isMentor = await User.findOne({
      where: {
        id: id,
        mentor: true,
      },
    });

    if (!isMentor) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    let markAsComplete = await FeedbackRequest.findOne({
      where: { id: feedbackrequestId },
    });

    markAsComplete.status = true;
    await markAsComplete.save();

    res.status(200).json({ msg: "Exercise Marked As Complete" });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  submitFeedBack,
  getAllFeedBackRequestsForms,
  getUserFeedBackRequestForms,
  assignFeedBackToMentor,
  addFeedBack,
  getAssignedFeedBacks,
  getMentorFeedback,
  getSelectedFeedback,
  markFeedbackRequestComplete,
  deleteFeedbackRequest 
};
