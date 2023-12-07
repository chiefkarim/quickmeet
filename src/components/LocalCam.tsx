import { useEffect, useState, useRef } from "react";
import CamOn from "../assets/images/camon.svg?react"
import CamOff from "../assets/images/camOff.svg?react"
import MicOn from "../assets/images/micOn.svg?react"
import MicOff from "../assets/images/micOff.svg?react"
import  FullScreen from "../assets/images/fullscreen.svg?react"
import getMediaAccess from "../utils/getMediaAccess";

//export getMediaAccess and use it on the load of meeting page(put it in utils folder)
function LocalCam({camera,mice}:{camera:boolean,mice:boolean}) {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
  const [cam, setCam] = useState<boolean | null>(camera);
  const [audio, setAudio] = useState<boolean | null>(mice)
  const videoRef = useRef<null | HTMLVideoElement>(null);

  //gets the userMedia
  
  useEffect(() => {
    //make it into a function and export it
    //responsive video
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);
// pass input,cam,audio as arguments
    getMediaAccess({input:"all",cam:cam,audio:audio}).then((MediaStream)=>{
      if(typeof MediaStream != "boolean"){
        setStream(MediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
      setCam(true);
    setAudio(true) }) 

    // clean up event listener
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [screenWidth]);

  // clean up media tracks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  function toggleAudio(){
    if(audio && stream){
      stream.getAudioTracks().forEach((track) => track.stop())
      setAudio(false)
    }else{
      getMediaAccess({input:"audio",cam:cam,audio:audio}).then((MediaStream)=>{
        if(typeof MediaStream != "boolean"){
          setStream(MediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      setAudio(true) }) 
      
    }
  }

  function toggleCam(){
    if (cam && stream){
      stream.getVideoTracks().forEach((track) => track.stop());
      setCam(false);
    } else {
      getMediaAccess({input:"video",cam:cam,audio:audio}).then((MediaStream)=>{
        if(typeof MediaStream != "boolean"){
          setStream(MediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
        setCam(true);
      }) 
      

    }
  }
  
  function toggleFullscreen() {
    const video =document.querySelector<HTMLVideoElement>(".localCam")
    if (document.fullscreenElement) {
        // If fullscreen is active, exit fullscreen
        document.exitFullscreen();
    } else {
        // If fullscreen is not active, request fullscreen
        if(video != null){
          video.requestFullscreen();
          video.controls = false
        }
    }
    
}

  return (
    <div className="relative localCam h-full">
      
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          className=" h-full w-full"
          controls={false}
        ></video>
     <div className="absolute flex w-full bottom-0 justify-between black-gradient-hover">
      <div>
      <button
        className=" bg-transparent text-white  "
        onClick={toggleCam}
      >
        {cam ? <CamOff/> :         <CamOn/>}
      </button>
      <button
        className="   bg-transparent"
        onClick={toggleAudio}
      >
        {audio ? <MicOff/> :         <MicOn/>}
      </button>
      </div>
      <button
        className=" bg-transparent  "
        onClick={toggleFullscreen}
      >
        <FullScreen />
      </button>
     </div>
    </div>
  );
}
export default LocalCam;
