export class Logger {

    static buildMessage(className, functionName, message) {
        var str = className + '.' + functionName + '()' ;
        while (str.length < 60) {
            str += " ";
        }
        return str + message;
    }

    static traceMessage(className, functionName, message) {
        console.log( Logger.buildMessage(className, functionName, message)  );
    }

    static traceError(className, functionName, message) {
        console.error( Logger.buildMessage(className, functionName, message)  );
    }


}