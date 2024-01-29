import { useState, useRef, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

import CamOn from "../assets/images/camon.svg?react";
import CamOff from "../assets/images/camOff.svg?react";
import MicOn from "../assets/images/micOn.svg?react";
import MicOff from "../assets/images/micOff.svg?react";

interface props {
  remoteStream: MediaStream | null;
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}
export interface Config {
  video: boolean | undefined;
  audio: boolean | undefined;
}

const RemoteVideo = ({ remoteStream, config, setConfig }: props) => {
  const [stream, setStream] = useState(remoteStream);
  const videoRef = useRef<null | HTMLVideoElement>(null);

  console.log(config);

  const updateConfig = () => {
    const video = stream?.getVideoTracks().some((track) => track.enabled);
    const audio = stream?.getAudioTracks().some((track) => track.enabled);
    setConfig({ video, audio });
  };

  useEffect(() => {
    updateConfig();
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <>
      <div className="remote-video relative w-full h-full object-cover">
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          controls={false}
          className="w-full h-full bg-black"
        ></video>
        <div className="absolute flex w-full bottom-0 justify-between black-gradient-hover">
          <div className="flex flex-row gap-2 m-2">
            {config.video ? <CamOn /> : <CamOff />}
            {config.audio ? <MicOn /> : <MicOff />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoteVideo;
