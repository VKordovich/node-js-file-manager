const TH = ['Name', 'Type'];

const printMessage = (message) => {
    console.log(`\n${message}`);
}

const printPathInfo = (path) => {
    console.log(`You are currently in ${path}`);
}

const printTableInfo = (data) => {
    const dirent = prepareDirent(data);
    console.table(dirent, TH);
}

const getType = (dirent) => {
    switch (true) {
        case dirent.isDirectory(): return 'directory';
        case dirent.isFile(): return 'file';
        default: return 'unknown';
    }
}

const prepareDirent = (data) => {
    return data.map(dirent => {
        const type = getType(dirent);
        return {
            'Name': dirent.name,
            'Type': type
        }
    })
}


export {printMessage, printPathInfo, printTableInfo}