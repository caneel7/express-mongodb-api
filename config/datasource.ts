import { config } from "dotenv";
import mongoose from "mongoose";
import { default as logger } from "../logger";

config();
class DataSource {

    datasource_uri: string;


    constructor(uri: string) {
        this.datasource_uri = uri;
        mongoose.connect(uri);
    }

    public async init() {
        return new Promise((resolve, reject) => {
            try {

                mongoose.connection.once('open', (data) => {
                    logger.log('Data Source Connection Status : ' + mongoose.connection.db?.databaseName);
                    resolve(true);
                })

            } catch (error) {
                logger.error(error);
                reject(error);
            }
        })
    }
}

const _datasource = new DataSource(process.env.DATASOURCE_URI || '');
export default _datasource;