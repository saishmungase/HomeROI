import express from "express";
import http from "http";
import { WebSocketServer } from 'ws';
import Worker from './woker.js';


const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const worker = new Worker();

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log(JSON.parse(data))
    const userReq = JSON.parse(data)
    switch(userReq.type){
        case "req":
            worker.addReq(userReq.body);
            ws.send(JSON.stringify({message : "Added To Queue"}))
            break;
        case "res":
            const res = worker.sendRes(userReq.user);
            ws.send(JSON.stringify(res));
            break;
        case "success":
            worker.resSuccess(userReq.user)
            ws.send(JSON.stringify({message : "Thank You For Using Service"}))
            break;
        default:
            ws.send(JSON.stringify(
                {
                    message : "Invalid Body !"
                }
            ));
            break;
        }
  });

});

app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});