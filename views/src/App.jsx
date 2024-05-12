import { Routes, Route } from "react-router-dom";
import Loginpage from "../src/Pages/LoginPage";
import Signup from "./pages/Signup";
import Interndashboard from "./Pages/Interndashboard";
import Mentordashboard from "./Pages/Mentordashboard";
import SingleFeedBack from "./pages/SingleFeedbackPage";
import Homepage from "./pages/HomePage";
import Unauthorized from "./pages/Unauthorized";
import Notfound from "./pages/Notfound";
import ForgotPassword from "./pages/ForgotPassword";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import AuthWrapper from "./Utility/AuthWrapper";


function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/intern/*" element={<AuthWrapper>{({ user }) => <Interndashboard user={user} />}</AuthWrapper>} />
        <Route path="/mentor/*" element={<AuthWrapper>{({ user }) => <Mentordashboard user={user} />}</AuthWrapper>} />
        <Route path="/feedback/:id" element={<AuthWrapper>{({ user }) => <SingleFeedBack user={user} />}</AuthWrapper>} />
        <Route path="/403" element={<Unauthorized />} />
        <Route path="/404" element={<Notfound />} />
        <Route path="/forgotpassword" element={< ForgotPassword/>} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
