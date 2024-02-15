import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";

const socket = io.connect("https://chatapp-one-woad.vercel.app");

const App = () => {
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    function onMessages(message) {
      console.log(message);
      setSuccess(true);
      setMessages((old) => [...old, message]);
    }

    function onError(error) {
      console.log(error);
      setError(error.error);
      setSuccess(false);
    }

    socket.on("message", onMessages);
    socket.on("error", onError);

    return () => {
      socket.off("message", onMessages);
      socket.off("error", onError);
    };
  }, []);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {
      username: username,
      chat: chat,
    });
    setMessages((old) => [
      ...old,
      {
        username: username,
        chat: chat,
      },
    ]);
    setChat("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("newuser", {
      username: username,
    });
  };

  return (
    <div className="grid justify-center align-middle h-5/6 m-4">
      <div className="w-full p-2 border-2 border-sky-500 ">
        <div className=" " style={{ display: success ? "none" : "block" }}>
          <form onSubmit={handleSubmit} className="my-2">
            <input
              className="border-2 border-sky-500 p-1 m-2 rounded-md w-96"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="submit"
              value="Start Chatting"
              className="bg-sky-400 p-2 rounded-lg m-2"
            />
          </form>
          <div>{error}</div>
        </div>
        <div style={{ display: success ? "block" : "none" }} className="  ">
          <form onSubmit={handleChatSubmit}>
            <input
              className="border-2 border-sky-500 p-1 m-2 rounded-md w-96"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Type your message here.."
            />
            <input
              type="submit"
              value="Send"
              className="bg-sky-400 p-2 rounded-lg m-2 w-20"
            />
          </form>
        </div>
        <hr className="h-0.5 bg-slate-400" />
        <div className="w-full h-96 p-2 overflow-auto">
          {messages.map((message, id) => (
            <div key={id}>
              <div className="font-medium text-xl ">{message.username}</div> :{" "}
              {message.chat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
