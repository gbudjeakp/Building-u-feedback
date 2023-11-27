import { Routes, Route } from "react-router-dom";
import Loginpage from "../src/Pages/LoginPage";
import Signup from "./pages/Signup";
import Interndashboard from "./Pages/Interndashboard";
import Mentordashboard from "./Pages/Mentordashboard";
import SingleFeedBack from "./pages/SingleFeedbackPage";
import Homepage from "./pages/HomePage";
import Unauthorized from "./pages/Unauthorized";
import Notfound from "./pages/Notfound";
import "@mantine/core/styles.css";
import "./index.css"
import { MantineProvider } from "@mantine/core";


function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/intern/*" element={<Interndashboard />} />
        <Route path="/mentor/*" element={<Mentordashboard />} />
        <Route path="/feedback/:feedbackrequestId" element={<SingleFeedBack />} />
        <Route path="/403" element={< Unauthorized />} />
        <Route path="/404" element={< Notfound />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
