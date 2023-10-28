import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Text, Button, Title } from '@mantine/core';
import svg from "../assets/cuate.svg";

const homepageStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Set the height to 100% of the viewport
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const titleStyles = {
  fontSize: '36px',
  fontWeight: 700,
  marginBottom: '20px',
  textAlign: "center"
};

const subTitleStyles = {
  fontSize: '20px',
  color: '#333',
  marginBottom: '40px',
  textAlign: "center"
};

const buttonStyles = {
  borderRadius: '20px',
  background: '#F9EB02',
  color: 'black', // Text color
};

const imageStyles = {
  maxWidth: '100%', // Ensure the image doesn't exceed its container's width
  height: 'auto', // Allow the image's height to adjust proportionally
};

const responsiveImageStyles = {
  maxWidth: '10%', // Adjust the image size for smaller screens
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <Container style={homepageStyles}>
      <div style={containerStyles}>
        <Title style={titleStyles}>Welcome to 
        Building-U-Feedback</Title>
        <img
          src={svg}
          alt="Girl Sitting"
          style={imageStyles}
          className="responsive-image" 
        />
        <Text style={subTitleStyles}>Request feedback easily with Feedback-U</Text>
        <Button size="lg" style={buttonStyles} onClick={handleGetStarted}>Get Started</Button>
        <style>
          {`
            @media (max-width: 768px) {
              .responsive-image {
                ${Object.keys(responsiveImageStyles).map(
                  (property) => `${property}: ${responsiveImageStyles[property]};`
                ).join(' ')}
              }
            }
          `}
        </style>
      </div>
    </Container>
  );
};

export default HomePage;
