import { useEffect, useState, useRef } from "react";
import CamOn from "../assets/images/camon.svg?react"
import CamOff from "../assets/images/camOff.svg?react"
import MicOn from "../assets/images/micOn.svg?react"
import MicOff from "../assets/images/micOff.svg?react"
import FullScreen from "../assets/images/fullscreen.svg?react"
import getMediaAccess from "../utils/getMediaAccess";
import { v4 as uuid } from "uuid"

//export getMediaAccess and use it on the load of meeting page(put it in utils folder)
function Video({ id, Stream, autoRun, updateStream }: { id: string | null, Stream: MediaStream | null, autoRun: boolean, updateStream: (action: string, stream: MediaStream, id: string | null) => void }) {
  const [stream, setStream] = useState<null | MediaStream>( Stream );
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
  const [cam, setCam] = useState<boolean | null>(null);
  const [audio, setAudio] = useState<boolean | null>(null)
  const videoRef = useRef<null | HTMLVideoElement>(null);
  [id] = useState(id != null ? id : uuid())



  //gets the userMedia
  useEffect(() => {

    if (stream && autoRun == false) {
      setCam(() => { return stream.getTracks().some((track) => track.kind === 'video') })
      setAudio(() => { return stream.getTracks().some((track) => track.kind === 'audio') })
      if (videoRef.current) {
        videoRef.current.srcObject = Stream;
      }
    }
    //make it into a function and export it
    //responsive video
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);
    // pass input,cam,audio as arguments
    if (autoRun == true) {
      getMediaAccess({ input: "all", cam: cam, audio: audio }).then((MediaStream) => {
        if (typeof MediaStream != "boolean") {
          setStream(() => { return MediaStream })
          
          updateStream("set", MediaStream, id)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }

        setCam(true);
        setAudio(true)
      })

    }

    // clean up event listener
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [screenWidth])

  // clean up media tracks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

  }, [stream]);

  function toggleAudio() {
    if (audio && stream) {
      const modifiedStream = stream.clone();
      modifiedStream.getAudioTracks().forEach((track) => {
        track.stop();
        modifiedStream.removeTrack(track);
      });
      setStream(() => { return modifiedStream })
      setAudio(false)
      updateStream("set", modifiedStream, id)


    } else {
      getMediaAccess({ input: "audio", cam: cam, audio: audio }).then((MediaStream) => {
        if (typeof MediaStream != "boolean") {
          setStream(() => { return MediaStream })
          updateStream("set", MediaStream, id)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }


        setAudio(true)
      })

    }
  }

  function toggleCam() {
    if (cam && stream) {
      const modifiedStream = stream.clone();
      modifiedStream.getVideoTracks().forEach((track) => {
        track.stop();
        modifiedStream.removeTrack(track);
      });
      setStream(() => { return modifiedStream })
      
      updateStream("set", modifiedStream, id)
      setCam(false);
    } else {
      getMediaAccess({ input: "video", cam: cam, audio: audio }).then((MediaStream) => {
        if (typeof MediaStream != "boolean") {
          setStream(() => { return MediaStream })
          updateStream("set", MediaStream, id)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
        }
        setCam(true);
      })


    }
  }

  function toggleFullscreen() {
    const video = document.querySelector<HTMLVideoElement>(".localCam")
    if (document.fullscreenElement) {
      // If fullscreen is active, exit fullscreen
      document.exitFullscreen();
    } else {
      // If fullscreen is not active, request fullscreen
      if (video != null) {
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
            {cam ? <CamOff /> : <CamOn />}
          </button>
          <button
            className="   bg-transparent"
            onClick={toggleAudio}
          >
            {audio ? <MicOff /> : <MicOn />}
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
export default Video;
