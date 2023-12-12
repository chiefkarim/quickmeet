import { useEffect } from "react";

interface LocalVideo {
  stream: null | MediaStream;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const LocalVideo: React.FC<LocalVideo> = ({ stream, videoRef }) => {
  // clean up media tracks
  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      playsInline={true}
      autoPlay={true}
      className=" h-full w-full"
      controls={false}
    ></video>
  );
};

export { LocalVideo };
