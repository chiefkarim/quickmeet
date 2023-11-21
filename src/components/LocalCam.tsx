import { useEffect, useState, useRef } from "react";

function LocalCam(){
    const [stream,setStream] = useState<null | MediaStream>(null)
    const [screenWidth,setScreenWidth] = useState<null | number>(null)
    const [camState,setCamState] = useState(true)
    const videoRef =useRef< null | HTMLVideoElement>(null)

//gets the userMedia
    async function getMediaAccess(){if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try{
         const mediaStream = await navigator.mediaDevices.getUserMedia({audio:true,video:{ facingMode:"user",width:screenWidth || 883,height:{min:402}}})
        setStream(mediaStream)
        if(videoRef.current){
          videoRef.current.srcObject = stream
        }
       } catch(error){
        console.error(error)
       }
      }}

    useEffect(()=>{
//responsive video
        const updateScreenWidth = ()=>{
      setScreenWidth(window.innerWidth)
        }
        window.addEventListener('resize',updateScreenWidth);
      
      getMediaAccess()

// clean up event listener
      return () => {
       window.removeEventListener('resize',updateScreenWidth)
       
      }
      },[screenWidth])

// clean up media tracks
    useEffect(() => {
        if(videoRef.current){
      
          videoRef.current.srcObject =stream
        }
        return () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };
      }, [stream]);

    function enableCam(){
        setCamState(true)
        getMediaAccess()
      
      }
    function disableCam(){
        setCamState(false)
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      
    return(<>
                  {camState == true ? (<video  ref={videoRef}  playsInline={true} autoPlay={true} className=" h-full w-full" controls></video>) :
                ''}
            <button className="absolute bottom-[40px] right-[30px] z-10 " onClick={disableCam}>disable </button>
            <button className="absolute bottom-[40px] left-[30px] z-10 " onClick={enableCam}>enable </button>

    </>)
}
export default LocalCam