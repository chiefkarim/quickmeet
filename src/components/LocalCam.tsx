import { useEffect, useState, useRef } from "react";
import CamOn from "../assets/images/camon.svg?react"
import CamOff from "../assets/images/camOff.svg?react"
import MicOn from "../assets/images/micOn.svg?react"
import MicOff from "../assets/images/micOff.svg?react"
import  FullScreen from "../assets/images/fullscreen.svg?react"


function LocalCam() {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
  const [cam, setCam] = useState(false);
  const [audio, setAudio] = useState(false)
  const videoRef = useRef<null | HTMLVideoElement>(null);

  //gets the userMedia
  async function getMediaAccess(){
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: "user",
            width: screenWidth || 883,
            height: { min: 402 },
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
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

    getMediaAccess().then(()=>{setCam(true);
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
      getMediaAccess().then(()=>{setAudio(true)})
    }
  }

  function toggleCam(){
    if (cam && stream){
      stream.getVideoTracks().forEach((track) => track.stop());
      setCam(false);
    } else {
      getMediaAccess().then(()=>{setCam(true)}) 

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
    <div className="relative localCam">
      
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          className=" h-full w-full"
          controls={false}
        ></video>
     <div className="absolute flex w-full bottom-0 justify-between hover:black-gradient transition-all duration-300">
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
