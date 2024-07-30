import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
const Editor = ({socketRef,roomId,onCodeChange}) => {
const editorRef=useRef(null);

    useEffect(()=>{
        async function init(){
            editorRef.current= Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                // /options languages,theme etc..
                mode:{
                    name:'javascript',json:true              
                },
                theme:'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,

            })

            
            // change is event of codeMiroor
            editorRef?.current?.on('change',(instance,changes)=>{
                console.log('changes',changes)
                const {origin}=changes;
                const code=instance.getValue();//isse editor m jitna v content h usko get kr skte h
                // 
                onCodeChange(code);

                // 
                if(origin !=='setValue')
                {
                    // console.log('working',code)
                    socketRef?.current?.emit(ACTIONS?.CODE_CHANGE, {
                        // 
                        roomId,
                        code,//jo code changes hue ..usko baki k clients ko vejne h uss room k 

                    }) 
                }
        //    
                console.log(code);
           
            })

          

        }
        init();
    },[])
    
    // DEBUG: realtime m update nhi ho rha tha..qki,socketRef.current m null aa rha tha ,usi m kaam krne lge the..to usko useEffect m socketRef.cuurent k basis krke re-render karwaya,taki phle mera socketRef aa jaye then change ho codes
    
    
    useEffect(()=>{
  // make sure socketRef is not null
if(socketRef?.current) 
{  socketRef?.current.on(ACTIONS?.CODE_CHANGE,({code})=>{
    if(code!==null)
    {
        editorRef?.current?.setValue(code)
    }
    // else
})
}
// is metho se,dusre client k codes likhe hue milenge
// editorRef.current.setValue(`console.log('Hello)`)

// clear listieners
return()=>{
    socketRef?.current?.off(ACTIONS.CODE_CHANGE)
}



},[socketRef?.current])//jb socketRef ayega tbhi ye run 



  return <textarea id='realtimeEditor'></textarea>

}

export default Editor