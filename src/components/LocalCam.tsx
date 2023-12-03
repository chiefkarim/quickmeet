import { useEffect, useState, useRef } from "react";
import CamOn from "../assets/images/camon.svg?react"
import CamOff from "../assets/images/camOff.svg?react"
import MicOn from "../assets/images/micOn.svg?react"
import MicOff from "../assets/images/micOff.svg?react"
import  FullScreen from "../assets/images/fullscreen.svg?react"


function LocalCam({camera,mice}:{camera:boolean,mice:boolean}) {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
  const [cam, setCam] = useState<boolean | null>(camera);
  const [audio, setAudio] = useState<boolean | null>(mice)
  const videoRef = useRef<null | HTMLVideoElement>(null);

  //gets the userMedia
  async function getMediaAccess(input:string){
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      let requestedMedia = null
      if (input == "audio"){
        if(cam == true){
          requestedMedia = {audio:true,video: {
            facingMode: "user",
            width: screenWidth || 883,
            height: { min: 402 },
          }}
        }else{
          requestedMedia={audio: true}
        }
      }else if(input == "video"){
        if(audio ==true){
          requestedMedia = {audio:true,video: {
            facingMode: "user",
            width: screenWidth || 883,
            height: { min: 402 },
          }}
        }else{
          requestedMedia = {video: {
           facingMode: "user",
           width: screenWidth || 883,
           height: { min: 402 },
         }}
        }
      }else{
        requestedMedia = {
          audio: true,
          video: {
            facingMode: "user",
            width: screenWidth || 883,
            height: { min: 402 },
          },
        }
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        setStream(mediaStream);
        if (videoRef.current) {
          console.log(videoRef.current.srcObject)
          videoRef.current.srcObject = stream;
          return true
        }
      } catch (error) {
        
        console.error(error);
        return false
      }
    }
    return false
  }

  useEffect(() => {
    //responsive video
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);

    getMediaAccess("all").then(()=>{setCam(true);
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
      getMediaAccess("audio").then(()=>{setAudio(true)})
    }
  }

  function toggleCam(){
    if (cam && stream){
      stream.getVideoTracks().forEach((track) => track.stop());
      setCam(false);
    } else {
      getMediaAccess("video").then(()=>{setCam(true)}) 

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
