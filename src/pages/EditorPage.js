import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import toast from 'react-hot-toast';
import ACTIONS from '../Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

const EditorPage = () => {
// yehaan socket connection[initialization] krna h fir ref banake h uske andar store krna h jo v socket ka instace h..then emit the events
const socketRef=useRef(null) //useRef-->a hook ,to store data ,jo multiple render p hmko available hoga,aur uske change hone k karan hmara component re-render na ho
// useState m data change hone se component re-render ho jata but,useRef m nhi hota h
// same jaise ..har baar code change hoga to har baar thori re-render krunga componet ko

const codeRef=useRef(null);

// useLocation-->jo Router k andar data vja tha usko access k liye..[[username ,HomePage se..navigation m..as a prop ..line-25-26]]
const location=useLocation()
// 
const {roomId}=useParams()
const reactNavigator = useNavigate();


const[clients,setClients]=useState([])
useEffect(()=>{
    const init=async()=>{
        socketRef.current=await initSocket();//init socket
        // server p ek event vejni h,jo ki join event hogi..[[]]
        //
        socketRef.current.on('connect_error', (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));

        function handleErrors(e) {
            console.log('socket error', e);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
        }
        socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location?.state?.username
        }) 
        // Listeining for joined event
        socketRef?.current?.on(ACTIONS.JOINED,
            ({clients,username,socketId})=>{
                // jo join hua usko nhi notify krna h
                if(username !== location?.state?.username)
                {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined the room`);

                }
                // saare connected clients ko set kr diya
                setClients(clients);
                // DEBUG:AUTO SYNC CODES ON FIRST LOAD
                // JOINED K BAAD JO CODE H USKO ,JOINED CLIENT K EDITOR M SHOW KRNA H..ON FIRST LOAD
             
                // note=>useRef..yehaa useState use nhi kr skte..m=nhi to har ek key stroke pe componet re-render hoga..
                // so,useRef..yeha
                socketRef?.current?.emit(ACTIONS?.SYNC_CODE,
                    {
                    code:codeRef?.current,
                        socketId,//jo join kiya sirf usko sync krna h
                    }
                    ) 

        })

///////
///////
//////


 // listeinig for disconnected...
 socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
    toast.success(`${username} left the room`)
// client ki lists m se uss socket ki id ko nikal do
setClients((prev)=>{
    return prev.filter(
        (client) => client?.socketId !== socketId
    );
})

})
    }
   
    init();
// always clear listeners after use..otherwise memory leak problem arises
return ()=>{
            socketRef?.current?.disconnect();
            socketRef?.current?.off(ACTIONS.JOINED);
            socketRef?.current?.off(ACTIONS.DISCONNECTED);
   
}

},[])
async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
}
function leaveRoom() {
    reactNavigator('/');
}


// 
if(!location.state)
{
    return <Navigate to="/" />
}

  return (
    <div
    className='mainWrap'
    >
    {/* left side */}
    <div className='aside'>
    <div className='asideInner'>
    <div className='logo'>
    <img className='logoImage' src='/code-sync.png' alt='logo'/>
    </div>
    <h3 className=' connected'>Connected</h3>
    <div className='clientsList'>
{
    clients.map((client) =>
    (
        <Client key={client?.sockedId} username={client?.username} />
    )
    )
}
    </div>

    </div>
{/* buttons */}
<button className="btn copyBtn" onClick={copyRoomId}> Copy ROOM ID</button>
<button className="btn leaveBtn" onClick={leaveRoom}> Leave </button>
    </div> 



{/* right side--editor */}
<div className="editorWrap">
<Editor
    socketRef={socketRef}
    roomId={roomId}
    onCodeChange={(code)=>{
        codeRef.current=code; 
    }}
     
/>
</div>
   

    
    </div>
  )
}

export default EditorPage