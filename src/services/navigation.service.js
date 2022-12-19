import {homedir} from "os";
import fs from 'fs';
import path from "path";
import {printPathInfo, printTableInfo} from "./log.service.js";
import {isExist} from "./fs.service.js";

const HOME_DIR = homedir();
const statePath = new Map([
    ['currentPath', null],
    ['previousPath', null],
    ['root', path.parse(process.cwd()).root]
]);

const getFileNameAndDir = (pathToFile) => {
    return [
        path.parse(pathToFile).dir,
        path.parse(pathToFile).base,
        path.parse(pathToFile).name
    ]
}
const createFilePath = (filePath) => {
    const currentPath = statePath.get('currentPath');
    const isSamePath = filePath.startsWith(currentPath.slice(0, 2))
    return isSamePath ? filePath : path.join(currentPath, path.sep,`${filePath}`);
}
const updatePath = (newPath) => {
    const currentPath = statePath.get('currentPath');
    statePath.set('previousPath', currentPath);
    statePath.set('currentPath', newPath);
}
const showCurrentPath = () => {
    const currentPath = statePath.get('currentPath');
    printPathInfo(currentPath);
}

const getCurrentPath = () => statePath.get('currentPath');
const upFn = () => {
    const currentPath = statePath.get('currentPath');
    let newPath = path.join(currentPath, '..');
    const isRoot = newPath === statePath.get('root');
    newPath = isRoot ? statePath.get('root') : newPath;

    updatePath(newPath);
}
const cdFn = async (newPart) => {
    const lastSymbolIndex = newPart.length - 1;

    if(newPart[lastSymbolIndex] === path.sep) newPart = newPart.slice(0, lastSymbolIndex);

    const isAbsolute = path.isAbsolute(newPart);
    const currentPath = statePath.get('currentPath');
    const newPath = isAbsolute ? newPart : path.join(currentPath, `/${newPart}`);
    const isCorrectPath = await isExist(newPath);

    if(!isCorrectPath) throw new Error();

    updatePath(newPath);
}
const lsFn = async () => {
    const currentPath = statePath.get('currentPath');
    const dirList = await fs.promises.readdir(currentPath, {withFileTypes: true});
    printTableInfo(dirList);
}
const initStartPath = () => {
    updatePath(HOME_DIR);
    showCurrentPath();
}

export {initStartPath, showCurrentPath, upFn, cdFn, lsFn, createFilePath, getFileNameAndDir, getCurrentPath};