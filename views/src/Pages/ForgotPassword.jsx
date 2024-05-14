import React, { useState } from "react";
import { Stepper, Button, Group, TextInput } from "@mantine/core";
import Otpinput from "../components/Otpinput";
import axios from "axios";

function ForgotPassword() {
  const [active, setActive] = useState(3);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);

  const nextStep = async () => {
    try {
      let response;
      if (active === 0) {
        // Make the API call to sendToken endpoint
        response = await axios.post("/forgotPassword", { username: email });
        if (response.status === 200) {
          setEmailSubmitted(true);
        }
      } else if (active === 1) {
        // Make the API call to checkToken endpoint
        response = await axios.get("/checkToken");
        if (response.status === 200) {
          setOtpValidated(true);
        }
      }
      
      // Check if response status is 200
      if (response && response.status === 200) {
        setActive((current) => (current < 3 ? current + 1 : current));
      } else {
        console.error("Error:", response.data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        color="#F9EB02"
        sizes={{ xs: "md", sm: "lg" }}
      >
        <Stepper.Step label="First step" description="Create an account">
          <div>
            <p>Step 1 content: Request For OTP enter email below</p>
            <TextInput
              type="email"
              placeholder="Enter your email"
              radius="md"
              size="lg"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          <div>
            <p>Step 2 content: Verify email</p>
            <p>Enter the OTP from email below.</p>
            <Otpinput />
          </div>
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          <div>
            <p>Step 3 content: Enter new password</p>
            <TextInput
              type="password"
              placeholder="Enter your new password"
              radius="md"
              size="lg"
            />
          </div>
        </Stepper.Step>
        <Stepper.Completed>
          <p>Completed, click back button to get to previous step</p>
        </Stepper.Completed>
      </Stepper>

      <Group style={{ marginTop: 20 }} position="center">
        <Button onClick={prevStep} color="#F9EB02">
          Back
        </Button>
        {(active === 0 && emailSubmitted) || (active === 1 && otpValidated) && (
          <Button onClick={nextStep} color="#F9EB02">
            Next step
          </Button>
        )}
      </Group>
    </div>
  );
}

export default ForgotPassword;
