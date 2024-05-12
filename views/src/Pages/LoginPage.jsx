import React from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { setUser } from "../features/Auth/authSlice"; 
import axios from "axios";
import {
  TextInput,
  Button,
  Container,
  Paper,
  Text,
  Anchor,
  Center,
  Group,
} from "@mantine/core";

const homepageStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh", 
};

const buttonStyles = {
  borderRadius: "20px",
  background: "#F9EB02",
  color: "black", 
};

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToLogin = () => {
    navigate("/signup");
  };

  const navigateToForgotpassword  = ()=>{
    navigate("/forgotpassword")
  }

  const form = useForm({
    initialValues: { userName: "", password: "" },

    validate: {
      userName: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Your password must be at least 8 characters" : null,
    },
  });

  const handleFormSubmit = async () => {
    form.validate();

    if (form.isValid) {
      const userData = {
        userName: form.values.userName,
        password: form.values.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/api/users/login",
          userData,
          {
            withCredentials: true, 
          }
        );

        if (response.status === 200) {
          dispatch(setUser(response.data.user));

          if (response.data.user.mentor) {
            navigate("/mentor/feedbackqueue");
          } else {
            navigate("/intern/myrequests");
          }
        } else {
          console.log("API request failed");
          console.log(response);
          alert("Something went wrong, try again");
        }
      } catch (error) {
        console.error("Error submitting the form data:", error);
        console.log(error.response); 
        alert("Something went wrong, try again");
      }
    } else {
      return;
    }
  };

  return (
    <Container style={homepageStyles}>
      <Center>
        <Paper shadow="xs" p="xl">
          <Text size="xxl" weight={700} align="center" mb="xl">
            Login to Account
          </Text>
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <div style={{ marginTop: "1.5rem" }}>
              <TextInput
                withAsterisk
                required
                label="Email"
                placeholder="user@mail.com"
                {...form.getInputProps("userName")}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <TextInput
                withAsterisk
                required
                label="Password"
                type="password"
                placeholder="Enter Password"
                {...form.getInputProps("password")}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <Button type="submit" size="sm" style={buttonStyles}>
                Login
              </Button>
            </div>
          </form>

          <div style={{ marginTop: "1.5rem" }}>
            <Group position="center" align="center" spacing="xs">
              <Text size="md" c="dimmed">
                Don't Have An Account?
              </Text>
              <Anchor onClick={navigateToLogin} size="md" component="button">
                Sign Up
              </Anchor>
            </Group>
            <Anchor onClick={navigateToForgotpassword} size="md">
                Forgot password
              </Anchor>
          </div>
        </Paper>
      </Center>
    </Container>
  );
}

export default LoginPage;
