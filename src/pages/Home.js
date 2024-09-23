import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate=useNavigate();
    const [roomId, setRoomId] =useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        // /id generate
        const id=uuidV4();
        // console.log(id)
        setRoomId(id)
        toast?.success('Created a new room');
    };
// /join room
const joinRoom=()=>{
    if(!roomId || !username)
    {
        toast.error('Please enter a username and ROOM ID');
        return;
    }
    console.log("editor m aa gye")
    // else redirect to editor
//     navigate(`/editor/${roomId}`,{   
//             username
// })
navigate(`/editor/${roomId}`, {
    state: {
        username,roomId
    },
});
// 
console.log("editor navigate done")
};
    
const handleInputEnter = (e) => {
    if (e.code === 'Enter') {//enter click krne se Enter key code hi click hota h
        joinRoom();
    }
};

  return (
    <div className='homePageWrapper'>
<div className='formWrapper'>
<img src='/code-sync.png' alt='code-sync page' className='homePageLogo' />
<h4 className='mainLabel'>Paste Invitation ROOM ID</h4>
<div className='inputGroup'>
<input className='inputBox' type='text'
onChange={(e)=>
setRoomId(e.target.value)
}
 placeholder='ROOM ID' 
 value={roomId}
 onKeyUp={handleInputEnter}

 />

<input className='inputBox' type='text' 

placeholder='USERNAME'
onChange={(e)=> setUsername(e.target.value)
}
value={username}
onKeyUp={handleInputEnter}
/>
<button
 onClick={joinRoom}
 className='btn joinBtn'>Join</button>
<span className='createInfo'>
If you don't have an invite then create a {" "}
<a 
onClick={createNewRoom}
href=""
className='createNewBtn'
>
New Room
</a>
</span>
</div>

</div>
<footer>
<h4>
    Built with 🔥 by &nbsp;
    <a href="https://github.com/mohit1721">Mohit </a>
</h4>
</footer>
    </div>
  )
}

export default Home