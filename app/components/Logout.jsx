"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../Utils/APIRoutes";

export default function Logout() {
    const router = useRouter();

    const handleClick = async () => {
        try {
            const storedUser = localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY);
            if (storedUser) {
                const { _id } = JSON.parse(storedUser);
                const { status } = await axios.get(`${logoutRoute}/${_id}`);

                if (status === 200) {
                    localStorage.clear();
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <Button onClick={handleClick} title="Logout">
            <BiPowerOff />
        </Button>
    );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }

  &:hover {
    background-color: #7f6fd1; /* Slight hover effect */
  }
`;
