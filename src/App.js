import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const closeChat = async () => {
    await socket.emit("leave_room", { text: `(${username}) Has Left!!`, room });
    setShowChat(false);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          closeChat={closeChat}
        />
      )}
    </div>
  );
}

export default App;

{
  /* <div className="box_send_recive_msg">
<h1>{room} Room</h1>
<div className="box_recive_msg">
  {messageList?.map((item, key) => (
    <div className="box_msg" key={key}>
      <div>
        <h2>{item.currentMessage}</h2>
        <div>
          <span>{item.name}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  ))}
</div>
<div className="box_send_msg">
  <input
    type="text"
    placeholder="Say Hay....."
    onChange={handleInputMsg}
    value={currentMessage}
  />
  <button onClick={handleSendMsg}>send</button>
</div>
</div> */
}
