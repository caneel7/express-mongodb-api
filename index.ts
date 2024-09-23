import epxress from 'express';
const app = epxress();
import { default as logger } from './logger';
import { AddressInfo } from 'net';
import _datasource from './config/datasource';
import router from './src/router';

app.use(epxress.json())
.use(epxress.urlencoded())
.use(router);


const server = app.listen(process.env.PORT || 8080, async() => {

    await _datasource.init();

    const { address, port } = server.address() as AddressInfo;
    
    logger.log(`Server Started On Port ${address} ${port}`);
})