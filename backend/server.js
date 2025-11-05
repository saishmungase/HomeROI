import { WebSocketServer } from 'ws';
import Worker from './woker.js';

const wss = new WebSocketServer({ port: 8080 });

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