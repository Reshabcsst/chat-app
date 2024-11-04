import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg, replyMessage, clearReply }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(replyMessage ? `Replying to: ${replyMessage} - ${msg}` : msg);
      setMsg("");
      clearReply(); // Clear reply after sending
    }
  };

  return (
    <Container replyMessage={replyMessage}>
      {replyMessage && (
        <div className="reply-preview">
          <span>{replyMessage}</span>
          <button onClick={clearReply}>&times;</button>
        </div>
      )}
      <div className="button-container">
        <div className="emoji" ref={emojiPickerRef}>
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker className="emoji-picker-react" onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}



const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  gap:1rem;
  position:relative;

   .reply-preview {
    display: flex;
    align-items: center;
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    max-width: 80%;
    padding: 0.5rem 1rem;
    background-color: #ffffff34;
    border-radius: 1rem;
    color: white;
    font-size: 0.9rem;
    gap:.5rem;
    /* Smooth transition with both translateY and scale for animation effect */
    transform: ${({ replyMessage }) => (replyMessage ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)")};
    opacity: ${({ replyMessage }) => (replyMessage ? "1" : "0")};
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    
    span {
      flex: 1;
    }
       button {
      border-radius: 50%;
      display: flex;
      font-size:20px;
      height:30px;
      width:30px;
      display:flex;
      justify-content:center:
      align-items:center;
      cursor:pointer;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      }
  }


  @media screen and (max-width: 720px) {
   padding:0 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;

      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -482px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    position: relative;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
   
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

        @media screen and (max-width: 720px) {
           font-size:.8rem;
           }

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      cursor:pointer;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;

      svg {
        font-size: 2rem;
        color: white;
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.5rem 1.5rem;
        svg {
          font-size: 1rem;
        }
      }

        @media screen and (max-width: 720px) {
          padding: 0.5rem;
            svg {
             font-size: 1rem;
            }
        }
    }
  }
`;