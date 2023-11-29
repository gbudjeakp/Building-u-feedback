import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Text, Container, Paper, Stack, Button } from "@mantine/core";
import { useDispatch } from "react-redux";
import { fetchFeedBackOnFeedbackRequestForm } from "../features/Feedbacks/feedbackSlice";
import axios from "axios";
import TextEditor from "../components/TextEditor";
import formatCreatedAt from "../Utility/DateFormatter";

const feedbackContainer = {
  zIndex: "20",
  paddingBottom: "20rem",
};

function SingleFeedbackPage() {
  const { feedbackrequestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [feedBack, setFeedBacks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const isMentor = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/feedback/getfeedbackid/${feedbackrequestId}`,
          {
            withCredentials: true,
          }
        );

        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchData();
  }, [feedbackrequestId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await dispatch(fetchFeedBackOnFeedbackRequestForm(feedbackrequestId));
        setFeedBacks(response.payload);
        setLoadingFeedback(false); 
        setLoadingData(false)
      } catch (error) {
        console.error("Error fetching feedbacks on requests:", error);
        setLoadingFeedback(false); 
        setLoadingData(false)
      }
    };

    fetchFeedbacks();
  }, [dispatch, feedbackrequestId]);

  useEffect(() => {
    if (!loadingData && !loadingFeedback) {
      setLoadingData(false);
    }
  }, [loadingData, loadingFeedback]);

  const handleGoToDashboard = () => {
    const isMentor = true;
    if (isMentor) {
      navigate("/mentor/feedbackqueue");
    } else {
      navigate("/intern/myrequests");
    }
  };

  console.log(feedBack.data)

  return (
    <Container>
      <div style={feedbackContainer}>
        <Paper
          shadow="xs"
          p="sm"
          withBorder
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <Text>Intern Name: {data.studentName}</Text>
            <Text>Topic Of Learning Session: {data.topicOfLearningSession}</Text>
            <Text>Completed: {data.status ? "Yes" : "No"}</Text>
            <Text>
              Link to exercise: <a href={data.codeLink}>{data.codeLink}</a>
            </Text>
            <Text>{formatCreatedAt(data.createdAt)}</Text>
          </div>
          <Stack direction="horizontal" spacing="sm">
            <Button
              style={{ color: "black" }}
              color="#F9EB02"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Paper>
      </div>

      {loadingData || loadingFeedback ? (
        <Text>Loading...</Text>
      ) : (
        feedBack.data.map((item, index) => (
          <div key={index}>
            <Paper>{item.feedback}</Paper>
          </div>
        ))
      )}

      {isMentor && (
        <Paper shadow="xs" p="sm" withBorder>
          <TextEditor isMentor={true} feedbackrequestId={feedbackrequestId}/>
        </Paper>
      )}
    </Container>
  );
}

export default SingleFeedbackPage;
