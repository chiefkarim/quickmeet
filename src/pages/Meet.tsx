import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import { useEffect, useState, useRef } from "react";

function Meet() {
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
  //responsiveness video
  const updateScreenWidth = ()=>{
setScreenWidth(window.innerWidth)
  }
  window.addEventListener('resize',updateScreenWidth);

//Get user media
getMediaAccess()
// clean up event listener
return () => {
 window.removeEventListener('resize',updateScreenWidth)
 
}
},[screenWidth])
function disableCam(){
  setCamState(false)
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}
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

  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
      
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
        
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
          
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-off-white">
              {camState == true ? (<video  ref={videoRef}  playsInline={true} autoPlay={true} className=" h-full w-full" controls></video>) :
                ''}
            <button className="absolute bottom-[40px] right-[30px] z-10 " onClick={disableCam}>disable </button>
            <button className="absolute bottom-[40px] left-[30px] z-10 " onClick={enableCam}>enable </button>

            </div>
            <div className=" flex gap-[1rem] w-full justify-between ">
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white ">

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
