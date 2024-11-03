"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./chat/page";
import styled from "styled-components";
import loader from './public/loader.gif';
import Image from "next/image";

const Home = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Check server connection with a GET request
        await axios.get("https://chat-app-a9vb.onrender.com");
        setIsConnected(true);
      } catch (error) {
        console.log("Server unavailable. Retrying...");
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkServer();

    // Retry every 3 seconds if not connected
    const retryInterval = setInterval(() => {
      if (!isConnected) {
        checkServer();
      } else {
        clearInterval(retryInterval); // Stop retrying if connected
      }
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(retryInterval);
  }, [isConnected]);

  return (
    <>
      {isChecking ? (
        <LoadingContainer>
          <Image src={loader} alt="loader" className="loader" unoptimized />
        </LoadingContainer>
      ) : isConnected ? (
        <Chat />
      ) : (
        <LoadingContainer>
          <p>Unable to connect to the server. Retrying...</p>
        </LoadingContainer>
      )}
    </>
  );
};

export default Home;

// Styled component for the loading state
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #ffffff;

  img {
    margin-top: 0.5rem;
    height: 150px;
    width:auto;
  }
    p {
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }
`;
