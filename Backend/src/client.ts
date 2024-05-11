import WebSocket from "ws";
import * as readline from "readline";
import cors from "cors";
import express from "express";
const app = express();
const r1 = readline.createInterface(process.stdin, process.stdout);

app.use(cors());
r1.question("Write your client Id:", (clientId) => {
  r1.question("write your channel Id:", (channelId) => {
    const ws = new WebSocket("ws://localhost:8000");
    ws.on("open", function open() {
      console.log("Successfully server connected");
      ws.send(JSON.stringify({ type: "open", id: clientId, ch: channelId }));
      function askMeAgain() {
        r1.question("Talk to Channel Members\n", function (message) {
          const data = message.toString().trim();
          ws.send(
            JSON.stringify({
              type: "messages",
              dt: data,
              id: clientId,
              ch: channelId,
            })
          );
          console.log("Successfully sended to server ");
          setTimeout(askMeAgain, 2000);
        });
      }
      askMeAgain();
      ws.on("message", function serverMessage(message: any) {
        const data = JSON.parse(message);
        switch (data.type) {
          case "clMessage":
            const rId = data.rId;
            const rCh = data.rCh;
            const rM = data.clM;
            if (clientId === rId && rCh === channelId) {
              console.log("your message was successfully sent to channel  ");
            } else if (clientId != rId && rCh === channelId) {
              console.log(
                `Received from channel message this id ${rId}: ${rM}`
              );
            }

            break;

          case "message":
            const serverMessage = data.mess;
            console.log(`Received from server side: ${serverMessage} `);
        }
      });
    });
  });
});
