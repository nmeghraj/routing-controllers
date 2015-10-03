import {Response} from "express";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Common controller utilities.
 */
export class ControllerUtils {

    /**
     * Makes "require()" all js files (or custom extension files) in the given directory.
     */
    static requireAll(directories: string[], extension: string = '.js'): any[] {
        let files: any[] = [];
        directories.forEach((dir: string) => {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach((file: string) => {
                    if (fs.statSync(dir + '/' + file).isDirectory()) {
                        let requiredFiles = this.requireAll([dir + '/' + file], extension);
                        requiredFiles.forEach((file: string) => files.push(file));
                    } else if (path.extname(file) === extension) {
                        files.push(require(dir + '/' + file));
                    }
                });
            }
        }); // todo: implement recursion
        return files;
    }

    static jsonResponseFromPromise(response: Response, promise: { then(result: any, error: any): any }) {
        return promise.then((result: any) => {
            response.json(result);

        }, (error: any) => {
            console.error(error);
            response.status(500);
            response.send(error);

        });
    }

    static regularResponseFromPromise(response: Response, promise: { then(result: any, error: any): any }) {
        return promise.then((result: any) => {
            response.send(result);

        }, (error: any) => {
            console.error(error);
            response.status(500);
            response.send(error);

        });
    }

    static flattenRequiredObjects(requiredObjects: any[]) {
        return requiredObjects.reduce((allObjects, objects) => {
            return allObjects.concat(Object.keys(objects).map(key => objects[key]));
        }, []);
    }

}