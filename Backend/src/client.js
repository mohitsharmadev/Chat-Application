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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const r1 = readline.createInterface(process.stdin, process.stdout);
app.use((0, cors_1.default)());
r1.question("Write your client Id:", (clientId) => {
    r1.question("write your channel Id:", (channelId) => {
        const ws = new ws_1.default("ws://localhost:8000");
        ws.on("open", function open() {
            console.log("Successfully server connected");
            ws.send(JSON.stringify({ type: "open", id: clientId, ch: channelId }));
            function askMeAgain() {
                r1.question("Talk to Channel Members\n", function (message) {
                    const data = message.toString().trim();
                    ws.send(JSON.stringify({
                        type: "messages",
                        dt: data,
                        id: clientId,
                        ch: channelId,
                    }));
                    console.log("Successfully sended to server ");
                    setTimeout(askMeAgain, 2000);
                });
            }
            askMeAgain();
            ws.on("message", function serverMessage(message) {
                const data = JSON.parse(message);
                switch (data.type) {
                    case "clMessage":
                        const rId = data.rId;
                        const rCh = data.rCh;
                        const rM = data.clM;
                        if (clientId === rId && rCh === channelId) {
                            console.log("your message was successfully sent to channel  ");
                        }
                        else if (clientId != rId && rCh === channelId) {
                            console.log(`Received from channel message this id ${rId}: ${rM}`);
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
