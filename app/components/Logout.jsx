"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
        <Button className="Btn" onClick={handleClick} title="Logout">
            <Sign>
                <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
            </Sign>
            <Text className="text">Logout</Text>
        </Button>
    );
}


const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: rgb(255, 65, 65);

  
      @media screen and (max-width: 650px)  {
        width:35px;
        height:35px
      }

  &:hover {
    width: 125px;
    border-radius: 40px;
  }

  &:active {
    transform: translate(2px, 2px);
  }
`;

const Text = styled.div`
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: 0.3s;

  ${Button}:hover & {
    opacity: 1;
    width: 70%;
    padding-right: 10px;
  }
`;

const Sign = styled.div`
  width: 100%;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Button}:hover & {
    width: 30%;
    padding-left: 20px;
  }

  svg {
    width: 17px;

      @media screen and (max-width: 650px)  {
        width:14px;
      }

    path {
      fill: white;
    }
  }
`;
