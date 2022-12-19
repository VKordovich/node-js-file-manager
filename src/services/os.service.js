import os from "os";
import {printMessage} from "./log.service.js";
import * as util from "util";

const cpusInfo = () => {
    const cpus = os.cpus();
    const result = cpus.reduce((acc, currentValue, currentIndex) => {
        acc[++currentIndex] = [currentValue.model, `${currentValue.speed/1000}GHz`];
        return acc;
    }, {totalCores: cpus.length});
    return util.inspect(result);
}

const handleOS = (flag) => {
    flag = flag.toLowerCase();
    switch (flag) {
        case '--eol':
            printMessage(JSON.stringify(os.EOL))
            break;
        case '--cpus':
            printMessage(cpusInfo());
            break;
        case '--homedir':
            printMessage(os.homedir());
            break;
        case '--username':
            printMessage(os.userInfo().username);
            break;
        case '--architecture':
            printMessage(os.arch());
            break;
        default:
            throw new Error('Invalid input');
    }
}

export {handleOS}