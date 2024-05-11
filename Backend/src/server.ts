import WebSocket from "ws";
import * as readline from "readline";
import express from "express";
const app = express();
const r1 = readline.createInterface(process.stdin, process.stdout);
const wt = new WebSocket.Server({ port: 8000 });
let clientId: string[] = [];
let channelName: { [key: string]: string } = {};

wt.on("connection", function (ws: any) {
  console.log("successfully connected to client ");

  ws.on("message", function incoming(message: string) {
    const data = JSON.parse(message);
    console.log("🚀incoming ~ data:", data);

    switch (data.type) {
      case "open":
        const client: string = data.id;
        clientId.push(client);
        console.log(`successfully ${client} connected`);
        const channelNames = data.ch;
        channelName[channelNames] = client;
        console.log(`successfully stored your channel Name: ${channelNames}`);
        repeatCode();
        break;

      case "messages":
        const clientMessage = data.dt;
        const clId = data.id;
        const clChannelId = data.ch;
        console.log(`Received from this client ${clId}: ${clientMessage}`);
        console.log(clId);
        console.log(clChannelId);
        console.log(clientMessage);

        broadcast(clId, clChannelId, clientMessage);

        break;
    }
  });

  function repeatCode() {
    r1.question("Talk to all client\n", (dataS) => {
      const data = dataS.toString().trim();
      //JSON.stringify converts javascript object to string
      ws.send(JSON.stringify({ type: "message", mess: data }));
      repeatCode();
    });
  }

  function broadcast(clId: any, clChannelId: any, clientMessage: any) {
    wt.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "clMessage",
            rId: clId,
            rCh: clChannelId,
            clM: clientMessage,
          })
        );
      }
    });
  }
});
