"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const readline = __importStar(require("readline"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const r1 = readline.createInterface(process.stdin, process.stdout);
const wt = new ws_1.default.Server({ port: 8000 });
let clientId = [];
let channelName = {};
wt.on("connection", function (ws) {
    console.log("successfully connected to client ");
    ws.on("message", function incoming(message) {
        const data = JSON.parse(message);
        console.log("🚀incoming ~ data:", data);
        switch (data.type) {
            case "open":
                const client = data.id;
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
    function broadcast(clId, clChannelId, clientMessage) {
        wt.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify({
                    type: "clMessage",
                    rId: clId,
                    rCh: clChannelId,
                    clM: clientMessage,
                }));
            }
        });
    }
});
