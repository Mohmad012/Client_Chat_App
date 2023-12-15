import React, { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, closeChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [imgName, setImgName] = useState("");
  const [file, setFile] = useState("");
  const [nameLeftEnterRoom, setNameLeftEnterRoom] = useState("");

  const imgRef = useRef();

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.img !== "") {
        const blob = new Blob([data.img], { type: "file" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          data["img"] = reader.result;
          setMessageList((list) => [...list, data]);
        };
      } else {
        setMessageList((list) => [...list, data]);
      }
    });

    socket.on("Who_left_room", (name) => {
      setNameLeftEnterRoom(name);
    });

    async function enterRoom() {
      await socket.emit("enter_room", {
        text: `(${username}) Has Enter The Room`,
        room,
      });

      socket.on("Who_enter_room", (name) => {
        setNameLeftEnterRoom(name);
      });
    }
    enterRoom();
  }, [socket]);

  console.log("messageData", messageData);

  const sendMessage = async () => {
    if (currentMessage !== "" || file !== "") {
      const messageData = {
        author: username,
        room,
        currentMessage,
        imgName,
        img: file,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);

      if (messageData.img !== "") {
        const blob = new Blob([messageData.img], { type: "file" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
          messageData.img = reader.result;
          setMessageList((list) => [...list, messageData]);
        };
      } else {
        setMessageList((list) => [...list, messageData]);
      }

      setCurrentMessage("");
      setImgName("");
      setFile("");
      setNameLeftEnterRoom("");
      imgRef.current.value = "";
    }
  };

  const selectFile = (e) => {
    setImgName(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat In Room {room}</p>
        <span onClick={closeChat}>x</span>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, key) => (
            <div
              key={key}
              className="message"
              id={username === messageContent.author ? "you" : "other"}>
              <div>
                <div
                  className={`message-content ${
                    messageContent.img !== "" ? "thereImg" : messageContent.img
                  }`}>
                  {messageContent.img !== "" ? (
                    <>
                      <img
                        src={messageContent.img}
                        alt={messageContent.imgName}
                        style={{ width: 140, height: "auto" }}
                      />
                      <p>{messageContent.currentMessage}</p>
                    </>
                  ) : (
                    <p>{messageContent.currentMessage}</p>
                  )}
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
          {nameLeftEnterRoom !== "" && (
            <p className="box-left">{nameLeftEnterRoom}</p>
          )}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <div className="formInput">
          <label htmlFor="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1"
              viewBox="0 0 64 64">
              <path
                d="M262 487c-47-47-64-77-45-77 4 0 24 17 45 37l38 37V345c0-140 9-186 30-155 5 8 10 78 10 155v139l38-37c40-39 52-45 52-24 0 12-99 117-111 117-2 0-28-24-57-53zM157 84c-20-20 7-24 164-24 132 0 170 3 167 13-4 9-47 13-164 15-88 1-163-1-167-4z"
                transform="matrix(.1 0 0 -.1 0 64)"></path>
            </svg>
          </label>
          <input
            type="file"
            id="file"
            onChange={selectFile}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            ref={imgRef}
            className="inputCuFile"
          />
        </div>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
