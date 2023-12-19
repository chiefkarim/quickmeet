import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import Video from "../components/Video";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";
import Navbar from "../components/Navbar";
import { Webrtc } from "../components/Webrtc";
import { v4 as uuid } from "uuid";
import { Socket } from "socket.io-client";

export interface streams {
  id: string;
  stream: MediaStream;
}

const pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

function Meet() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [streams, setStreams] = useState<streams[]>([]);
  const params = useParams();
  const roomID = params.id;
  const [enterRoom, setEnterRoom] = useState<boolean>(false);
  const [localStreamId, setLocalStreamId] = useState<string | null>(null);
  const localStream =
    streams.find((item) => item.id === localStreamId)?.stream || null;

  SocketConnect(setSocket);
  function updateStream(
    action: string,
    stream: MediaStream,
    id: string | null
  ) {
    if (action === "set") {
      if (streams.filter((stream) => stream.id === id).length != 0) {
        const newStreams = streams.map((item) => {
          if (item.id === id) {
            return { id, stream };
          } else {
            return item;
          }
        });
        setStreams(() => {
          return newStreams;
        });
        return id;
      } else {
        if (stream instanceof MediaStream) setLocalStreamId(id);
        if (id) {
          setStreams((streams) => {
            return [...streams, { id, stream }];
          });
          return id;
        } else {
          const id = uuid();
          setStreams((streams) => {
            return [...streams, { id, stream }];
          });
          return id;
        }
      }
    } else if (action === "remove" && id) {
      const newStreams = streams.filter((item) => item.id !== id);
      setStreams(newStreams);
      return id;
    }
  }

  // clean up media tracks
  useEffect(() => {
    return () => {
      if (streams) {
        streams.forEach((stream) => {
          console.log(stream.id);
          stream.stream.getTracks().forEach((track) => track.stop());
        });
      }
    };
  }, [streams]);

  async function join() {
    try {
      pc.onicecandidate = ({ candidate }) => {
        socket?.emit("iceCandidate", { candidate });
      };
      // video stream to rtcpeerconnection
      const localStream = streams.find((stream) => stream.id === localStreamId);
      const videoTrack = localStream?.stream.getVideoTracks()[0];
      const audioTrack = localStream?.stream.getAudioTracks()[0];

      console.log({ audioTrack: audioTrack, videoTrack: videoTrack });

      if (videoTrack) pc.addTrack(videoTrack);
      if (audioTrack) pc.addTrack(audioTrack);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log({ ldes: pc.localDescription });
      socket?.emit("localDescription", {
        description: pc.localDescription,
      });
    } catch (err) {
      console.log(err);
    }
    setEnterRoom(true);
  }
  if (enterRoom === false) {
    return (
      <>
        <Navbar />
        <section className="pt-0 mt-0 flex flex-col items-center justify-center ">
          <div className="bg-white   ">
            <div className="relative localCam h-[70vh] ">
              <Video
                id={null}
                Stream={localStream}
                autoRun={true}
                updateStream={updateStream}
              />
            </div>
            <div className="mt-[30px] flex justify-center">
              <button
                onClick={join}
                className="bg-green   text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white"
              >
                join room
              </button>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <div className="bg-white pt-5 ">
        <section className="px-0">
          <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
            <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
              <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-extra-light-grey">
                {/* <Video
                  id={localStreamId}
                  Stream={localStream}
                  autoRun={false}
                  updateStream={updateStream}
                /> */}
              </div>
              <div className=" flex gap-[1rem] w-full justify-between ">
                {streams.map((stream) => {
                  if (stream.id != localStreamId) {
                    return (
                      <li
                        key={stream.id}
                        className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey "
                      >
                        <Video
                          id={stream.id}
                          Stream={stream.stream}
                          autoRun={false}
                          updateStream={updateStream}
                        />
                      </li>
                    );
                  }
                })}
              </div>
            </div>
            <MessagingBoard socket={socket} roomID={roomID} />
            <Webrtc
              socket={socket}
              roomID={roomID}
              pc={pc}
              streams={streams}
              updateStream={updateStream}
            />
          </div>
        </section>
        <section className="px-[3rem] ">
          <Footer />
        </section>
      </div>
    );
  }
}
export default Meet;
