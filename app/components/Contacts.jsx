// Contacts.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Logo from "../public/logo.png";

export default function Contacts({ contacts, changeChat, isSidebarOpen, socket }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));
      if (data) {
        console.log(socket.current)
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
        socket.current?.emit('add-user', data._id);
      }
    };
    fetchData();
  }, [socket]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('user-online', (userId) => {
        console.log(`User ${userId} is online`); // Debugging line
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.add(userId);
          return updated;
        });
      });

      socket.current.on('user-offline', (userId) => {
        console.log(`User ${userId} is offline`); // Debugging line
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      });
    }

    // Clean up listeners on unmount
    return () => {
      if (socket.current) {
        socket.current.off('user-online');
        socket.current.off('user-offline');
      }
    };
  }, [socket]);



  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container isSidebarOpen={isSidebarOpen}>
          <div className="brand">
            <Image src={Logo} alt="logo" />
            <h3>REZA</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                  {onlineUsers.has(contact._id) && <span className="online-status"></span>}
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  transition: transform 0.3s ease;
    transform: ${({ isSidebarOpen }) => (isSidebarOpen ? "translateX(0)" : "translateX(-100%)")};

  @media screen and (min-width: 650px) {
    transform: none; 
  }
     @media screen and (max-width: 650px)  {
        grid-template-rows: 10% 80% 10%;
     }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

      @media screen and (max-width: 650px)  {
       padding:15px;
     }
    img {
      height: 2rem;
      width:fit-content;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      border-bottom:1px solid #080420;

            &:hover:not(.selected) {
              background-color: #9a86f3b0;
            }

        @media screen and (max-width: 650px)  {
        min-height:auto;
        }

      .avatar {
        img {
          height: 3rem;

           @media screen and (max-width: 720px) {
            height:2rem
           }
        }
      }
      .username {
       position:relative;
        h3 {
          color: white;
          font-size:22px;
 
          @media screen and (max-width: 650px)  {
          font-size:14px;
          }
        }
           .online-status {
            position: absolute;
            top: 6px;
            right: -30px;
            width: 17px;
            height: 17px;
            background-color: #05bb05;
            border-radius: 50%;
          }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    padding:10px;
    gap: .6rem;
    .avatar {
      img {
        max-height: 4rem;
        min-height:3rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
        @media screen and (max-width: 720px) {
            gap:.3rem;
              .username {
            h2 {
              font-size: .8rem;
            }
        }
            .avatar img{
            max-height:3rem;
            margin-right:10px;
            min-height:2rem;
            }
         }
  }
`;
