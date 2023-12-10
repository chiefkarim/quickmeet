import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import LocalCam from "../components/LocalCam";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";
import getMediaAccess from "../utils/getMediaAccess";
import { useRef } from "react";
import CamOn from "../assets/images/camon.svg?react"
import CamOff from "../assets/images/camOff.svg?react"
import MicOn from "../assets/images/micOn.svg?react"
import MicOff from "../assets/images/micOff.svg?react"
import Navbar from "../components/Navbar";

function Meet() {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const params = useParams();
  const roomID = params.id;
  const [cam, setCam] = useState<boolean>(false);
  const [audio, setAudio] = useState<boolean>(false)
  const [enterRoom, setEnterRoom] = useState<boolean>(false)
  const socket = SocketConnect()
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
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
    getMediaAccess({ input: "all", cam: cam, audio: audio }).then((MediaStream) => {
      if (typeof MediaStream != "boolean") {
        setStream(MediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
      setCam(true);
      setAudio(true)
    })

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
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  function toggleAudio() {
    if (audio && stream) {
      stream.getAudioTracks().forEach((track) => track.stop())
      setAudio(false)
    } else {
      getMediaAccess({ input: "audio", cam: cam, audio: audio }).then((MediaStream) => {
        if (typeof MediaStream != "boolean") {
          setStream(MediaStream)
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
      stream.getVideoTracks().forEach((track) => track.stop());
      setCam(false);
    } else {
      getMediaAccess({ input: "video", cam: cam, audio: audio }).then((MediaStream) => {
        if (typeof MediaStream != "boolean") {
          setStream(MediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
        setCam(true);
      })


    }
  }

  function join() {
    setEnterRoom(true)
  }
  if (enterRoom === false) {


    return (<>
      <Navbar />
      <section className="pt-0 mt-0 flex flex-col items-center justify-center ">
        <div className="bg-white   ">
          <div className="relative localCam h-[70vh] ">

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
            </div>
          </div >
          <div className="mt-[30px] flex justify-center">
            <button onClick={join} className="bg-green   text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white">join room</button>
          </div>
        </div>
      </section>
    </>
    );
  } else {
    return (<div className="bg-white pt-5 ">
      <section className="px-0">
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-extra-light-grey">
              <LocalCam camera={cam} mice={audio} Stream={stream} autoRun={false} />
            </div>
            <div className=" flex gap-[1rem] w-full justify-between ">
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey "></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
            </div>
          </div>
          <MessagingBoard socket={socket} roomID={roomID} />
        </div>
      </section>
      <section className="px-[3rem] ">
        <Footer />
      </section>
    </div>
    )
  }
}
export default Meet;
