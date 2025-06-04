import { Log } from "./log.entity";
import { LogModel, logSchema } from "./log.model";

var ip = require("ip");

export class LogService{
    async add(description: string, result: boolean){
        //TODO: creare lo script per salvare un log delle modifiche
        const logData: Log = {
            date: new Date(),
            ipAddress: ip.address(),
            description: description,
            result: result
        };

        const newLog = await LogModel.create(logData);
        return newLog;
    }
}

export default new LogService();