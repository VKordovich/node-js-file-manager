import {getCurrentPath} from "../services/navigation.service.js";
import {isExist} from "../services/fs.service.js";
import path from "path";

const _useNameArg = /^--username/;
const _greeting = 'Welcome to the File Manager, '
const _parting = 'Thank you for using File Manager, '
const getGreeting = (name) => {
    return `${_greeting}${name}!`;
}
const getParting = (name) => {
    return `${_parting}${name}, goodbye!`;
}
const getUserName = (args) => {
    let name;
    const [,, ...rest] = args;
    rest.forEach((value) => {
        if(_useNameArg.test(value)) {
            const startIndex = value.lastIndexOf('=') + 1;
            name = value.substring(startIndex)
        }
    })
    return name;
}
const separatorName = async (flag) => {
    const stringChunk = flag.trim();
    const chunkSplitStr = stringChunk.split(' ');
    const data = {
        path: '',
        firstIndex: 0
    }
    await chunkSplitStr.reduce(reducerManager(data, 'path'), Promise.resolve(''))
    return [data.path, chunkSplitStr.slice(++data.firstIndex)].flat();
}
const separatorPath = async (flag) => {
    const stringChunk = flag.trim();
    const chunkSplitStr = stringChunk.split(' ');
    const paths = {
        firstPath: '',
        firstIndex: 0,
        secondPath: ''
    }
    await chunkSplitStr.reduce(reducerManager(paths, 'firstPath'), Promise.resolve(''))
    await chunkSplitStr.slice(++paths.firstIndex).reduce(reducerManager(paths, 'secondPath'), Promise.resolve(''))

    return [paths.firstPath, paths.secondPath];
}

const reducerManager = (paths, key) => {
    const currPath = getCurrentPath();
    return async (acc, curr, index) => {
        acc = `${await acc} ${curr}`.trim();
        const pathStr = path.join(currPath, path.sep, acc);
        const hasPath = await isExist(pathStr);
        if (hasPath) {
            paths[key] = pathStr;
            paths.firstIndex = index;
        }
        return acc;
    };
}

export {getGreeting, getUserName, getParting, separatorPath, separatorName};