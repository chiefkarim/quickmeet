import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import { useEffect, useState, useRef } from "react";

function Meet() {
  const [stream,setStream] = useState<null | MediaStream>(null)
  const [screenWidth,setScreenWidth] = useState<null | number>(null)
  const [camState,setCamState] = useState(true)
  const videoRef =useRef< null | HTMLVideoElement>(null)

useEffect(()=>{
  //responsiveness video
  const updateScreenWidth = ()=>{
setScreenWidth(window.innerWidth)
  }
  window.addEventListener('resize',updateScreenWidth);

// clean up media tracks and event listener
return () => {
 window.removeEventListener('resize',updateScreenWidth)
 
}
},[screenWidth])
function disableCam(){
  setCamState(false)
}
//Get user media

async function  requestMediaAccess(){
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  console.log("Let's get this party started")
  try{
   const mediaStream = await navigator.mediaDevices.getUserMedia({audio:true,video:{ facingMode:"user",width:screenWidth || 883,height:{min:402}}})
  setStream(mediaStream)
  if(videoRef.current){
    videoRef.current.srcObject = mediaStream
  }
 } catch(error){
  console.error(error)
 }
}else{
  console.log("device not supported")
}

}

  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
      
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between ">
        
          <div className="flex flex-col gap-[1rem]">
          
            <div className="localVideo max-w-[65vw] overflow-hidden  min-h-[75vh] relative bg-off-white">
              {camState == true ? (<video  ref={videoRef}  playsInline={true} muted={true} className=" h-full w-full" controls></video>) :
                ''}
            <button className="absolute bottom-[10px] right-[30px] z-10 " onClick={disableCam}>disable </button>
            <button className="absolute bottom-[10px] left-[10px] z-10 " onClick={requestMediaAccess}>Allow </button>
            </div>
            <div className=" flex gap-[2.31rem]">
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white">

              </div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
            </div>
          </div>
          <MessagingBoard />
        </div>
      </section>
      <section className="px-[3rem] " >
        <Footer  />
      </section>
    </div>
  );
}
export default Meet;
