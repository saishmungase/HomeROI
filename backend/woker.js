import { runFullRoiAnalysis } from './main/core.js'

export default class Worker{
    reqQ;
    resQ;

    constructor(){
        this.reqQ = [];
        this.resQ = [];
    }

    async addReq(message) {
        console.log(message)
        this.reqQ.push({
            user : message.user,
            url : message.url
        });

        await this.execute();
    }

    async execute(){
        if(this.reqQ.length < 1){
            return;
        }
        
        if(this.resQ.length > 100){
            emptyResQ();
        }

        const currJob = this.reqQ.pop();
        console.log(currJob)
        const analysis = await runFullRoiAnalysis(currJob.url)
        this.resQ.push({
            user : currJob.user,
            status : "in-queue", // in-queue or reached
            data : analysis
        });

        this.execute();
    }

    emptyResQ(){
        arr.filter(val => val.status !== "reached");
    }

    resSuccess(user){
        this.resQ.map((res)=>{
            if(res.user == user){
                res.status = "reached"
                return;
            }
        })
    }

    sendRes(user){
        const res = this.resQ.map((res) =>{
            if(res.user == user){
                return res;
            }
        })

        return res;
    }
}