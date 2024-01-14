import { useState, useRef, useEffect } from "react";
import CamOn from "../assets/images/camon.svg?react";
import CamOff from "../assets/images/camOff.svg?react";
import MicOn from "../assets/images/micOn.svg?react";
import MicOff from "../assets/images/micOff.svg?react";

interface props {
  Stream: MediaStream | null;
}

const RemoteVideo = ({ Stream }: props) => {
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const hasAudio = Stream?.getTracks().some((track) => track.kind === "audio");
  const hasVideo = Stream?.getTracks().some((track) => track.kind === "video");
  console.log(hasAudio, hasVideo);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = Stream;
    }
  }, [Stream, videoRef]);

  return (
    <>
      <div className="remote-video relative">
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          controls={false}
          className="w-56 h-32 bg-black"
        ></video>
        <div className="absolute flex w-full bottom-0 justify-between black-gradient-hover">
          <div className="flex flex-row gap-2 m-2">
            {hasVideo ? <CamOn /> : <CamOff />}
            {hasAudio ? <MicOn /> : <MicOff />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoteVideo;
