import React, { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Video from "./Video";
import RemoteVideo from "./remoteVideo";
import MessagingBoard from "./MessagingBoard";
import Footer from "./Footer";

interface Props {
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  socket: Socket | null;
  roomID: string | undefined;
}

const AferJoin: React.FC<Props> = ({
  localStream,
  setLocalStream,
  remoteStream,
  socket,
  roomID,
}) => {
  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-extra-light-grey">
              <Video
                id={localStream?.id}
                localStream={localStream}
                setLocalStream={setLocalStream}
                autoRun={false}
              />
            </div>
            <div className=" flex gap-[1rem] w-full justify-between ">
              <RemoteVideo Stream={remoteStream} />
              {/* {streams.map((stream) => {
                  console.log(streams);
                  if (stream.id != localStreamId) {
                    return (
                      <li
                        key={stream.id}
                        className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey "
                      >
                        <RemoteVideo Stream={stream.stream} />
                      </li>
                    );
                  }
                })} */}
            </div>
          </div>
          <MessagingBoard socket={socket} roomID={roomID} />
        </div>
      </section>
      <section className="px-[3rem] ">
        <Footer />
      </section>
    </div>
  );
};

export default AferJoin;
