import {startApp} from "./services/user.service.js";
import {printMessage} from "./services/log.service.js";
import {getGreeting, getUserName} from "./helper/user.utils.js";
import {initStartPath} from "./services/navigation.service.js";

const USER_NAME = getUserName(process.argv);
const GREETING = getGreeting(USER_NAME);
const init = async () => {
    printMessage(GREETING);
    startApp();
    initStartPath();
}
await init();