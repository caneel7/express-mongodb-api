import { getTimeStamp } from "./src/utils/common";

class Logger {

    constructor() {
        console.log(`------------------------------------------------------------\n`);
        console.log(`:: ${require('./package.json').name} ::               (v${require('./package.json').version})\n`);
        console.log(`------------------------------------------------------------\n`);
    }

    log(log: any) {
        console.log('\x1b[37m', `[${getTimeStamp()}] ` + log);  //yellow
    }

    error(err: any) {
        console.log('\x1b[31m', `[${getTimeStamp()}] ` + err);
    }

}

const _logger = new Logger();
export default _logger;