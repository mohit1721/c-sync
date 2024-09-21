// const express = require('express');
// const app = express();
// const http = require('http');
// const { Server } = require('socket.io');
// const ACTIONS = require('./src/Actions');
// const path = require('path');

// const server=http.createServer(app);//ye http ka server h
// const io=new Server(server);//http ka server socker server ko pass kr diye
// // ye event trigger ho jati h jaise hi koi socket connect ho jata h server ko
// app.use(express.static('build'));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// // // 'ihvefonjjoef' :"Mohit Kumar"
// // const userSocketMap={}
// const userSocketMap=new Map();
// function getAllConnectedClients(roomId)
// {
//     //iska type map hota h ..so to convert it to Array use Array,from
//   return Array.from(io?.sockets?.adapter?.rooms?.get(roomId) || [])?.map((socketId)=>{
//     return {
//         socketId,
//         username:userSocketMap[socketId],
//     }
//   });//pure socket server k andar[adaptor k anadar] jitne v rooms h ..usme se jiske v given roomId h usko get krega

// }

// io.on('connection',(socket)=>{
// console.log('socket connected',socket.id)
// // flow
// // jaise hi clinet join krta h...event[ACTIONS.JOIN] triggers from frontend se
// // jo client join ho rha h uska roomId aur username le rhe h
// // uss username kon store krte h map[userSocketMap] k anadar
// // the,us client ko join krate h uss room k anadr[roomId]
// // the,jo us room m oresent h ,sbki ek list get krke sbko notify[io.to krke] kr rhe h..with his username and socketId
// // ab iss event [ACTION.JOINED] ko hmare frontend m listen krna hoga..taki UI update kr paye



// socket?.on(ACTIONS?.JOIN,({roomId,username})=>{
//     // server m store ,user aur socket.io ki mapping
//     // we need to know kon se socketid kon se username ki h
// userSocketMap[socket?.id]=username

// //chn
// //userSocketMap.set(socket.id, username);

// // key,value pair
// socket?.join(roomId);//is socketid ko is roomId k andar join kr dega
// //when more clients present already,notifywhen new client joins
// const clients=getAllConnectedClients(roomId);//client list with object contain username and socketID
// console.log('Clients',clients);
// clients.forEach(({socketId})=>{
//     io?.to(socketId)?.emit(ACTIONS?.JOINED,{
//         clients,
//         username,
//         socketId:socket?.id
//     }) // io.to se jisko notify krna h usko btata h
// })
// })

// // socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
// //     userSocketMap[socket.id] = username;
// //     socket.join(roomId);
// //     const clients = getAllConnectedClients(roomId);
// //     clients.forEach(({ socketId }) => {
// //         io.to(socketId).emit(ACTIONS.JOINED, {
// //             clients,
// //             username,
// //             socketId: socket?.id,
// //         });
// //     });
// // });





// // SYNC CODE
// // JO CODE ALREADY PRESENT H USKO SBHI K EDITOR M SHOW KRNA H
// socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
//     //us room k andar emit krne se saare clients ko chla jayega

//     // DEBUG: io.to-->socket.in...code ki cursor aage nhi badh rhi thi..qki wo khud ko v send kr rha tha..
//     // ab socket.in se ,ye khud ko nhi send krega

//    socket?.in(roomId)?.emit(ACTIONS?.CODE_CHANGE,{code});

// })
// // 
// socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
//     //us room k andar emit krne se saare clients ko chla jayega
//   io?.to(socketId)?.emit(ACTIONS?.CODE_CHANGE,{code});

// })


// // disconnect socket on leaving someone..aur sbko norify v kr rhe h
// // jitna v emit kr rhe h ,sbko client p listen krna h
// socket.on('disconnecting',()=>{
//     const rooms= [...socket.rooms];
//     rooms.forEach((roomId)=>{
//         socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
//             socketId:socket.id,
//             username:userSocketMap[socket?.id]
//         })  
//     })
// // map se v delete krna h
// delete userSocketMap[socket?.id];
// socket.leave();//room se officially bahar 
// })

// }) //

// const PORT=process.env.PORT || 5000;
// server.listen(PORT,()=> 

// console.log(`Listening on port ${PORT}`));





///

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('../src/Actions');
const path = require('path');

const server = http.createServer(app);
const io = new Server(server);

//
app.use(express.static('build'));
//page refresh ....3:43:00-->page refresh..krne se server pe koi v request h..index.html ko serve kr dena
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = new Map();
//const userSocketMap2={};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap.get(socketId),
        };
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap.set(socket.id, username);
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        console.log('Clients', clients);

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap.get(socket.id),
            });
        });
        userSocketMap.delete(socket.id);
    });

    socket.on('disconnect', () => {
        userSocketMap.delete(socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

