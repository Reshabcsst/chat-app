"use client"
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../Utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Page() {
  const router = useRouter();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY)) {
        router.push("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY)
          )
        );
      }
    };
    checkUser();
  }, [router]);

  // Establish socket connection when the user is set
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Fetch contacts if the user has an avatar set
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          router.push("/set-avatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, router]);

  const handleChatChange = (chat) => {
    setIsSidebarOpen(!isSidebarOpen);
    setCurrentChat(chat);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Container isSidebarOpen={isSidebarOpen}>
      <div className="container">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        <Contacts
          contacts={contacts}
          changeChat={handleChatChange}
          isSidebarOpen={isSidebarOpen}
        />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} isSidebarOpen={isSidebarOpen} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100dvh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  transition: all 0.3s ease;


      .toggle-btn{
        display:none;
        position:fixed;
        padding:.5rem;
        margin-top:.8rem;
        z-index:500;
       }
      @media screen and (max-width: 650px)  {
       .toggle-btn{
         display:flex;
        }
      }
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

     @media screen and (max-width: 720px)  {
        height:100%;
        width:100%;
        grid-template-columns: 35% 65%;
      }
         @media screen and (min-width: 650px) {
            transform: none; 
        }

         @media screen and (max-width: 650px)  {
            height:100%;
            width:100%;
            transition: all 0.3s ease;
            grid-template-columns: ${({ isSidebarOpen }) => (isSidebarOpen ? '40% 60%' : '0% 100%')}; 
        }
  }
`;
