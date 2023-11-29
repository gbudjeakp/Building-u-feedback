// feedbackSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  feedbackRequests: [],
  assignedFeedbackRequests: [],
  feedbacksOnRequests: [], 
  loading: "idle",
  error: null,
};

const createAsyncThunkWithJwt = (type, url, method = "get") =>
  createAsyncThunk(type, async (id, thunkAPI) => {
    try {
      const response = await axios({
        method,
        url: id ? `${url}${id}` : url,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });

const createFeedbackRequest = createAsyncThunkWithJwt(
  "feedback/create",
  "http://localhost:5001/api/feedback/submitfeedback",
  "post"
);

const addFeedback = createAsyncThunkWithJwt(
  "feedback/add",
  "http://localhost:5001/api/feedback/addFeedBack/",
  "post"
);

const assignFeedbackRequest = createAsyncThunkWithJwt(
  "feedback/assign",
  "http://localhost:5001/api/feedback/assignFeedBackToMentor/",
  "post"
);

const getAssignedFeedbackRequests = createAsyncThunkWithJwt(
  "feedback/getAssign",
  "http://localhost:5001/api/feedback/getAssignedFeedBacks"
);

const fetchFeedbackRequests = createAsyncThunkWithJwt(
  "feedback/fetchAll",
  "http://localhost:5001/api/feedback/getfeedbackrequestForms"
);

const fetchFeedBackOnFeedbackRequestForm = createAsyncThunkWithJwt(
  "feedback/fetchFeedbackOnFeedbackRequestForm",
  "http://localhost:5001/api/feedback/getMentorFeedback/",
);

const markComplete = createAsyncThunkWithJwt(
  "feedback/markComplete",
  "http://localhost:5001/api/feedback/markFeedBackRequestComplete/",
  "get"
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackRequests.fulfilled, (state, action) => {
        state.feedbackRequests = action.payload;
        state.loading = "succeeded";
      })
      .addCase(createFeedbackRequest.fulfilled, (state, action) => {
        state.feedbackRequests.push(action.payload);
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        const { feedbackrequestId, feedback } = action.payload;
        console.log(action.payload)
        // const request = state.feedbacksOnRequests.find(
        //   (req) => req.id === requestId
        // );
        // if (request) {
        //   request.feedback.push(feedback);
        // }
      })
      .addCase(assignFeedbackRequest.fulfilled, (state, action) => {
        const { requestId, mentorId } = action.payload;
        const request = state.assignedFeedbackRequests.find(
          (req) => req.id === requestId
        );
        if (request) {
          request.mentorId = mentorId;
        }
      })
      .addCase(getAssignedFeedbackRequests.fulfilled, (state, action) => {
        state.assignedFeedbackRequests = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchFeedBackOnFeedbackRequestForm.fulfilled, (state, action) => {
        state.feedbacksOnRequests = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.loading = "succeeded";
      })
      .addCase(fetchFeedBackOnFeedbackRequestForm.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchFeedBackOnFeedbackRequestForm.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload
          ? action.payload
          : "Error fetching feedback on feedback request forms.";
      })
      .addCase(getAssignedFeedbackRequests.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getAssignedFeedbackRequests.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload
          ? action.payload
          : "Error fetching assigned feedback requests.";
      })
      .addCase(fetchFeedbackRequests.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchFeedbackRequests.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload
          ? action.payload
          : "Error fetching feedback requests.";
      });
  },
});

export {
  fetchFeedbackRequests,
  createFeedbackRequest,
  fetchFeedBackOnFeedbackRequestForm,
  addFeedback,
  assignFeedbackRequest,
  getAssignedFeedbackRequests,
  markComplete,
};

export default feedbackSlice.reducer
