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
        // When analysis completes, push result as 'ready'
        this.resQ.push({
            user : currJob.user,
            status : "ready",
            data : analysis
        });

        this.execute();
    }

    emptyResQ(){
        // Remove any results that have status === 'reached' (i.e., acknowledged)
        this.resQ = this.resQ.filter(val => val.status !== "reached");
    }

    resSuccess(user){
        // Remove results for the user when frontend confirms success
        this.resQ = this.resQ.filter((res) => res.user !== user)
    }

    sendRes(user){
        // Return only matching results (filtered). If none, return an empty array.
        return this.resQ.filter((res) => res.user == user);
    }
}