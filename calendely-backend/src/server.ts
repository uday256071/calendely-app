import { app } from './app';
import {PORT} from './config/env';

export function startServer() {
    app.listen(PORT, () => {
        console.log(`[Server]: Running on port ${PORT}`);
    });
}

startServer();


