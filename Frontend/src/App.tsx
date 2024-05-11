import React, { useMemo } from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
export default function App() {
  //dialog box
  const [clientId, setClient] = useState("");
  const [channelId, setChannel] = useState("");
  const [dialog, setDialog] = useState(true);

  const [message, setMessage] = useState([]);
  const [allMessage, setAllMessage] = useState<
    { sender: string; message: string }[]
  >([]);

  const ws = useMemo(() => new WebSocket("ws://localhost:8000"), []);

  useEffect(() => {
    ws.addEventListener("open", function open() {
      console.log("Successfully server connected");
    });
    ws.addEventListener("message", handleIncomingMessage);

    return () => {
      ws.removeEventListener("message", handleIncomingMessage);
    };
  }, []);

  const handleIncomingMessage = (messages: any) => {
    const data = JSON.parse(messages.data);

    console.log(data);
    switch (data.type) {
      case "clMessage":
        const rId = data.rId;
        const rCh = data.rCh;
        const rM = data.clM;
        const newMessage = { sender: rId, message: rM };
        if (clientId === rId && rCh === channelId) {
          console.log("your message was successfully sent to channel  ");
        } else if (clientId != rId && rCh === channelId) {
          console.log(`Received from channel message this id ${rId}: ${rM}`);
        }
        setAllMessage((prevMessage): any => [...prevMessage, newMessage]);
        break;

      case "message":
        const serverMessage = data.mess;
        console.log(`Received from server side: ${serverMessage} `);
    }
  };
  function sendMessage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        type: "messages",
        dt: message,
        id: clientId,
        ch: channelId,
      })
    );
    console.log(message);
  }
  const handleSubmit = () => {
    console.log(`1:${clientId} 2:${channelId}`);
    ws.send(JSON.stringify({ type: "open", id: clientId, ch: channelId }));

    setDialog(false);
  };

  return (
    <>
      <div className="container">
        {dialog && (
          <>
            <div className="dialog-container">
              <div className="dialog">
                <h2>Enter some details</h2>
                <h4> Chatting with friends</h4>
                <input
                  type="text"
                  placeholder="Give your Id"
                  value={clientId}
                  onChange={(e) => {
                    setClient(e.target.value);
                  }}
                />
                <input
                  type="text"
                  placeholder="Your Group Name"
                  value={channelId}
                  onChange={(e) => {
                    setChannel(e.target.value);
                  }}
                />
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </>
        )}
        <div className="mainContainer">
          <h1>Chat Application</h1>

          <div className="box">
            {allMessage.map((msg, index) => (
              <div
                key={index}
                className={`messageBox ${
                  msg.sender === clientId ? "rightMessage" : "leftMessage"
                }`}
              >
                {msg.sender === clientId ? "You: " : `${msg.sender}: `}
                {msg.message}
              </div>
            ))}
          </div>

          <div className="message">
            <form id="form">
              <input
                type="text"
                name="messageInp"
                placeholder="write your message"
                id="messageInp"
                value={message}
                onChange={(e: any) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                className="btn"
                onClick={(e) => {
                  sendMessage(e);
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
