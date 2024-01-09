import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { streams } from "../pages/Meet";

type UpdateStreamFunctionType = (
  action: "set" | "remove",
  stream: MediaStream,
  id: string | null
) => string | null | undefined;

interface prop {
  socket: Socket | null;
  roomID: string | undefined;
  pc: RTCPeerConnection;
  streams: streams[];
  updateStream: UpdateStreamFunctionType;
}

const Webrtc: React.FC<prop> = ({
  socket,
  roomID,
  pc,
  streams,
  updateStream,
}) => {
  useEffect(() => {
    console.log(roomID);

    socket?.on("localDescription", async ({ description }) => {
      console.log({ Rdes: description });

      pc.setRemoteDescription(description);
      pc.ontrack = (e) => {
        const newStream = new MediaStream([e.track]);
        const id = crypto.randomUUID();
        const rID = updateStream("set", newStream, id);
        console.log("remote stream id",rID);
      };

      socket?.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidateReply", { candidate });
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("remoteDescription", { description: pc.localDescription });
    });

    socket?.on("remoteDescription", async ({ description }) => {
      console.log(description);
      pc.setRemoteDescription(description);
      pc.ontrack = (e) => {
        const newStream = new MediaStream([e.track]);
        const id = crypto.randomUUID();
        let rID = updateStream("set", newStream, id);
      };

      socket?.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket?.emit("iceCandidateReply", { candidate });
      };
    });
  }, [socket]);
  return null;
};

export { Webrtc };
