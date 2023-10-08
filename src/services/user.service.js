import {getParting, getUserName, separatorName, separatorPath} from "../helper/user.utils.js";
import {cdFn, createFilePath, lsFn, showCurrentPath, upFn} from "./navigation.service.js";
import {
    readFile,
    renameFile,
    createFile,
    copyFiles,
    moveFile,
    deleteFile,
    calculateHash,
    compress, decompress
} from "./fs.service.js";
import {printMessage} from "./log.service.js";
import {handleOS} from "./os.service.js";

const USER_NAME = getUserName(process.argv);
const PARTING = getParting(USER_NAME);

const handleUP = () => {
    upFn();
}
const handleCD = async (path) => {
    await cdFn(path);
}
const handleLS = async () => {
    await lsFn();
}
const handleCAT = async (path) => {
    const filePath = createFilePath(path);
    const fileData = await readFile(filePath);
    printMessage(fileData);
}
const handleADD = async (path) => {
    const filePath = createFilePath(path);
    await createFile(filePath);
}
const handleRN = async (pathName) => {
    const [path, name] = await separatorName(pathName);
    await renameFile(path, name);
}
const handleCP = async (pathPath) => {
    const [firstPath, secondPath] = await separatorPath(pathPath);
    await copyFiles(firstPath, secondPath);
}
const handleMV = async (pathPath) => {
    const [firstPath, secondPath] = await separatorPath(pathPath);
    await moveFile(firstPath, secondPath);
}
const handleRM = async (pathPath) => {
    await deleteFile(pathPath);
}
const handleHASH = (path) => {
    const filePath = createFilePath(path);
    calculateHash(filePath);
}
const handleCOMPRESS = async (pathPath) => {
    const [firstPath, secondPath] = await separatorPath(pathPath);
    await compress(firstPath, secondPath);
}
const handleDECOMPRESS = async (pathPath) => {
    const [firstPath, secondPath] = await separatorPath(pathPath);
    await decompress(firstPath, secondPath);
}
const handleEXIT = () => {
    printMessage(`${PARTING}`);
    process.exit(0)
}
const handleERROR = (error) => {
    const message = error.message.includes('input') ? error.message : 'Operation failed';
    printMessage(message);
    showCurrentPath();
}

const handleInput = async (chunk) => {
    const stringChunk = chunk.toString().trim();
    const spaceIndex = stringChunk.indexOf(' ');
    const flag = stringChunk.substring(spaceIndex).trim();
    const command = spaceIndex === -1 ? stringChunk : stringChunk.substring(0, spaceIndex);

    switch (command) {
        case 'up':
            handleUP();
            break;
        case 'cd':
            await handleCD(flag);
            break;
        case 'ls':
            await handleLS();
            break;
        case 'cat':
            await handleCAT(flag);
            break;
        case 'add':
            await handleADD(flag);
            break;
        case 'rn':
            await handleRN(flag);
            break;
        case 'cp':
            await handleCP(flag);
            break;
        case 'mv':
            await handleMV(flag);
            break;
        case 'rm':
            await handleRM(flag);
            break;
        case 'os':
            handleOS(flag);
            break;
        case 'hash':
            handleHASH(flag);
            break;
        case 'compress':
            await handleCOMPRESS(flag);
            break;
        case 'decompress':
            await handleDECOMPRESS(flag);
            break;
        case '.exit':
            handleEXIT(stringChunk);
            break;
        default:
            throw new Error('Invalid input');
    }

    showCurrentPath();
};

const startApp = () => {
    process.stdin.on('data', handleInput);
    process.on('uncaughtException', handleERROR);
    process.on('SIGINT', handleEXIT);
}

export {startApp};