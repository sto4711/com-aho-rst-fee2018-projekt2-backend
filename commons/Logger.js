import dateformat from 'dateformat';
import express from "express";
import {ControllerAuthentication} from "../controller/ControllerAuthentication";
import {ControllerProduct} from "../controller/ControllerProduct";
import authentication from "express-authentication";


export class Logger {
    static buildMessage(className, functionName, message) {
        var str = className + '.' + functionName + '()' ;
        while (str.length < 60) {
            str += " ";
        }
        return dateformat(new Date(), "yyyy.mm.dd h:MM:ss ") + str + message;
    }

    static traceMessage(className, functionName, message) {
        console.log( Logger.buildMessage(className, functionName, message)  );
    }

    static traceError(className, functionName, message) {
        console.error( Logger.buildMessage(className, functionName, message)  );
    }


}
