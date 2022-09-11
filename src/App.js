import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect(process.env.REACT_APP_SOCKET_CONNECT_URL);

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
          <button
            onClick={joinRoom}
            onKeyPress={(e) => e.key === "Enter" && joinRoom()}>
            Join A Room
          </button>
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
