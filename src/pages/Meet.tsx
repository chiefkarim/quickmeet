import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import { useEffect, useState, useRef } from "react";
import SideBar from "../components/sidebar";

function Meet() {
  const [stream,setStream] = useState<null | MediaStream>(null)
  const [screenWidth,setScreenWidth] = useState<null | number>(null)
  const videoRef =useRef< null | HTMLVideoElement>(null)

useEffect(()=>{
  //responsiveness video
  const updateScreenWidth = ()=>{
setScreenWidth(window.innerWidth)
  }
  window.addEventListener('resize',updateScreenWidth);
//Get user mmdia
(async()=>{
  try{
   const mediaStream = await navigator.mediaDevices.getUserMedia({audio:true,video:{ facingMode:"user",width:screenWidth || 883,height:{min:402}}})
  setStream(mediaStream)
  if(videoRef.current){
    videoRef.current.srcObject = mediaStream
  }
 } catch(error){
  console.error(error)
 }

})()
// clean up media tracks and event listner
return () => {
 window.removeEventListener('resize',updateScreenWidth)
 const tracks = stream?.getTracks()
 tracks && tracks.forEach((track)=> track.stop())
}
},[screenWidth])

  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
      
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between ">
        
          <div className="flex flex-col gap-[1rem]">
          
            <div className="localVideo max-w-[65vw] overflow-hidden  min-h-[75vh]  bg-off-white">
            <video ref={videoRef} autoPlay={true} playsInline={true} controls className="h-full w-full"></video>
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
