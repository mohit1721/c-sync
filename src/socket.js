import {io} from 'socket.io-client'
// const dotenv = require("dotenv");
// dotenv.config();
export const initSocket=async()=>{
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
}
// ye fxn socket-client ka ek instance return kregi 