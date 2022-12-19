import fs from "fs";
import {createFilePath, getFileNameAndDir} from "./navigation.service.js";
import path from "path";
import {createHash} from "node:crypto";
import {printMessage} from "./log.service.js";
import zlib from "zlib";

const isExist = async (path) => {
    return await fs.promises.stat(path)
        .then((res) => {
            return !!res;
        })
        .catch(() => false )
}
const moveFile = async (first, second) => {
    await copyFiles(first, second);
    await deleteFile(first);
}
const deleteFile = async (path) => {
    const firstPath = createFilePath(path);
    await fs.promises.rm(firstPath);
}
const createFile = async (path) => {
    await fs.promises.writeFile(path, '', {flag: 'wx'})
}
const copyFiles = (first, second) => {
    const [, firstFileName] = getFileNameAndDir(first);
    const firstPath = createFilePath(first);
    const secondPath = createFilePath(path.join(second, `${firstFileName}`));
    return new Promise((resolve) => {
        fs.createReadStream(
            firstPath,
            {
                flag: 'wx',
                encoding: 'utf-8',
                autoClose: true
            }
        ).pipe(fs.createWriteStream(secondPath))
            .on('finish', (data) => {
            resolve(data)
        })
    })
}
const readFile = (filePath) => {
    return new Promise((resolve) => {
        fs.createReadStream(
            filePath,
            {
                flag: 'wx',
                encoding: 'utf-8',
                autoClose: true
            }
        ).on('data', (data) => {
            resolve(data)
        });
    })
};
const renameFile = async (filePath, newName) => {
    const [dir, oldFileName] = getFileNameAndDir(filePath);
    const dirPath = createFilePath(dir);
    const oldFilePath = createFilePath(filePath);
    const newFilePath = createFilePath(path.join(dir, `/${newName}`));

    await fs.promises.readdir(dirPath)
        .then(fileNames => {
            if(!fileNames.includes(oldFileName) || fileNames.includes(newName)) {
                throw new Error();
            }
            return fs.promises.rename(oldFilePath, newFilePath);
        })
};
const calculateHash = (fileToCalcPath) => {
    const hex = sha256(fileToCalcPath);
    printMessage(hex);
};
const compress = (fileToReadPath, fileToWritePath) => {
    const [,, firstFileName] = getFileNameAndDir(fileToReadPath);
    const firstPath = createFilePath(fileToReadPath);
    const secondPath = createFilePath(path.join(fileToWritePath, `${firstFileName}.br`));
    const brotli = zlib.createBrotliCompress();
    const readStreamFS = fs.createReadStream(firstPath, { flag: 'wx' });
    const writableStreamFS = fs.createWriteStream(secondPath);
    return new Promise((resolve) => {
        readStreamFS.pipe(brotli).pipe(writableStreamFS)
            .on('finish', (data) => {
            resolve(data)
        });
    })
};
const decompress = (firstPath, secondPath) => {
    const [,, firstFileName] = getFileNameAndDir(firstPath);
    const fileToReadPath = createFilePath(firstPath);
    const fileToWritePath = createFilePath(path.join(secondPath, `${firstFileName}.txt`));
    const brotli = zlib.createBrotliDecompress();
    const readStreamFS = fs.createReadStream(fileToReadPath, { flag: 'wx' });
    const writableStreamFS = fs.createWriteStream(fileToWritePath);
    return new Promise((resolve) => {
        readStreamFS.pipe(brotli).pipe(writableStreamFS)
            .on('finish', (data) => {
                resolve(data)
            });
    })
};
const sha256 = (content) => {
    return createHash('sha3-256').update(content).digest('hex');
}

export {isExist, createFile, copyFiles, readFile, renameFile, moveFile, deleteFile, calculateHash, compress, decompress};