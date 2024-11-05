import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../Utils/APIRoutes";

export default function ChatContainer({ currentChat, socket, isSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [swipeActive, setSwipeActive] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const swipeData = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });

  useEffect(() => {
    const fetchMessages = async () => {
      const userData = localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY);
      if (userData) {

        const data = await JSON.parse(userData);
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const userData = localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY);
    if (userData) {
      const data = await JSON.parse(userData);
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);

    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSwipeStart = (e) => {
    swipeData.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      endX: null,
      endY: null,
    };
  };

  const handleSwipeEnd = (message, index) => (e) => {
    swipeData.current.endX = e.changedTouches[0].clientX;
    swipeData.current.endY = e.changedTouches[0].clientY;

    const { startX, startY, endX, endY } = swipeData.current;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);

    if (diffY < 20 && diffX > 30) {
      setSwipeActive(index);
      setReplyMessage(message.message);
      scrollRef.current.style.setProperty('0', `${diffX}%`);

      setTimeout(() => {
        setSwipeActive(null);
        scrollRef.current.style.setProperty('0', '0');
      }, 400);
    }
  };

  return (
    <Container isSidebarOpen={isSidebarOpen}>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>

        <Logout />
      </div>
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            ref={scrollRef}
            key={uuidv4()}
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd(message, index)}
          >
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"} ${swipeActive === index ? "swipe" : ""
                }`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput
        handleSendMsg={handleSendMsg}
        replyMessage={replyMessage}
        clearReply={() => setReplyMessage("")}
      />
    </Container>
  );
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #9a86f3;
    padding: .5rem 2rem;
      @media screen and (max-width: 650px)  {
      padding:.5rem 1rem;
      }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
      display:flex;
      align-items-center;
        img {
          height: 2rem;

           @media screen and (max-width: 650px)  {
           margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '1.5rem')}; 
           }
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

     @media screen and (max-width: 650px)  {
           padding: 1rem 1rem;
           }
           
    .message {
      display: flex;
       -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        position: relative;
        transform: translateX(0);
        transition: transform 0.5s ease; 
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
          @media screen and (max-width: 720px) {
          max-width: 90%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }

    .swipe .content {
      // transform: translateX(-80px); 
      transform: translateX(calc(-100% + (0 * 1%)));
    }
  }
`;
