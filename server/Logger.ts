import {ILogObject, Logger} from 'tslog'
import { appendFileSync } from 'fs'

function logToFile(logObject: ILogObject){  //todo: should probably be async or something
    appendFileSync("./log.txt", 
    "log level: " + logObject.logLevel
    + "\t date: " + logObject.date
    + "\t file path: " + logObject.filePath
    + "\t function: " + logObject.functionName
    + "\t line number: " + logObject.lineNumber
    + "\t column number: " + logObject.columnNumber
    + "\t content: " + logObject.argumentsArray[0]
    + "\n")
}

export const logger: Logger = new Logger()
logger.attachTransport(
    {
        silly: logToFile,
        trace: logToFile,
        debug: logToFile,
        info: logToFile,
        warn: logToFile,
        error: logToFile,
        fatal: logToFile,
    },
    'debug'
)
