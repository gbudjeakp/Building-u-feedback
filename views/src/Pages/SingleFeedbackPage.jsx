import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Text, Container, Paper, Stack, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextEditor from "../components/TextEditor";
import formatCreatedAt from "../Utility/DateFormatter";

const feedbackContainer = {
  zIndex: "20",
  paddingBottom: "20rem",
};

function SingleFeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [feedBack, setFeedBacks] = useState([])


  const isMentor = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using axios
        const response = await axios.get(
          `http://localhost:5001/api/feedback/getfeedbackid/${id}`,
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
  }, []);


  useEffect(()=>{
    const fetchFeedbacks = async () =>{
       const response = await axios.get(
        `http://localhost:5001/api/feedback/getMentorFeedback/${id}`,
        {
          withCredentials: true,
        }
       )
       setFeedBacks(response.data.data)
    }

    fetchFeedbacks()
  }, [])

  console.log(feedBack)

  const handleGoToDashboard = () => {
    const isMentor = true;
    if (isMentor) {
      navigate("/mentor/feedbackqueue");
    } else {
      navigate("/intern/myrequests");
    }
  };

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
            <Text>
              Topic Of Learning Session: {data.topicOfLearningSession}
            </Text>
            <Text>Completed: {data.status ? "Yes" : "No"}</Text>
            <Text>
              Link to exercise: <a href={data.codeLink}>{data.codeLink}</a>
            </Text>
            <Text>{formatCreatedAt(data.createdAt)}</Text>

            {data.whoisAssigned ? (
              <Text>Assigned to: {data.whoisAssigned}</Text>
            ) : null}
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

      {feedBack.map((item, index)=>{
          return(
            <Paper key={index}>
              <Text>{item.feedback}</Text>
            </Paper>
          )
      })}

      {isMentor && (
        <Paper shadow="xs" p="sm" withBorder>
          <TextEditor isMentor={true} />
        </Paper>
      )}
    </Container>
  );
}

export default SingleFeedbackPage;
