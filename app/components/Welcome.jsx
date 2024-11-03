import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image"; 
import Robot from "../public/robot.gif"; 

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const user = await JSON.parse(
        localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY)
      );
      setUserName(user?.username || ""); // Handle case where user data might be null or undefined
    };

    fetchUserName();
  }, []);

  return (
    <Container>
      <Image src={Robot} alt="Robot GIF" width={320} height={320} unoptimized />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
