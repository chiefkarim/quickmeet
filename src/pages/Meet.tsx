import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";

import { v4 as uuid } from "uuid";
import { Socket } from "socket.io-client";

import BeforeJoin from "../components/BeforeJoin";
import AferJoin from "../components/AferJoin";

export interface streams {
  id: string;
  stream: MediaStream;
}

export type joinStatus = "loading" | "joined" | "error";

const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "turns:freeturn.tel:5349", username: "free", credential: "free" },
  ],
});

function Meet() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const params = useParams();
  const roomID = params.id;

  const [enterRoom, setEnterRoom] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [joinStatus, setJoinStatus] = useState<joinStatus>("loading");

  SocketConnect(setSocket, setError, setJoinStatus);

  useEffect(() => {
    console.log(socket);

    socket?.on("localDescription", async ({ description }) => {
      console.log("recieving localDescription of the remote peer");
      console.log({ Rdes: description });

      pc.setRemoteDescription(description);

      pc.ontrack = (e) => {
        setRemoteStream(new MediaStream([e.track]));
      };

      socket?.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidateReply", { candidate });
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log({ answer: answer });
      console.log("created an answer and set it as localDescription");

      socket.emit("remoteDescription", { description: pc.localDescription });
    });

    socket?.on("remoteDescription", async ({ description }) => {
      console.log("getting answer from other user");

      pc.setRemoteDescription(description);
      console.log(pc);
      console.log({ remoteDes: description });
      pc.ontrack = (e) => {
        console.log(e.track);
        setRemoteStream(new MediaStream([e.track]));
      };

      socket?.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket?.emit("iceCandidateReply", { candidate });
      };
    });
  }, [socket]);

  async function join() {
    try {
      pc.onicecandidate = ({ candidate }) => {
        socket?.emit("iceCandidate", { candidate });
      };
      // video stream to rtcpeerconnection
      const videoTrack = localStream?.getVideoTracks()[0];
      const audioTrack = localStream?.getAudioTracks()[0];

      console.log("adding video tracks", videoTrack);
      const combinedStream = new MediaStream();
      if (videoTrack) combinedStream.addTrack(videoTrack);
      if (audioTrack) combinedStream.addTrack(audioTrack);

      // adding both audio and video track to a specific stream.
      combinedStream.getTracks().forEach((track) => {
        pc.addTrack(track, combinedStream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log({ offerPC: pc });
      socket?.emit("localDescription", {
        description: pc.localDescription,
      });
      console.log("created offer and send local description to other user");
    } catch (err) {
      console.log(err);
    }
    setEnterRoom(true);
  }

  return (
    <>
      {enterRoom === false ? (
        <BeforeJoin
          localStream={localStream}
          setLocalStream={setLocalStream}
          join={join}
          error={error}
          joinStatus={joinStatus}
        />
      ) : (
        <AferJoin
          localStream={localStream}
          setLocalStream={setLocalStream}
          remoteStream={remoteStream}
          socket={socket}
          roomID={roomID}
        />
      )}
    </>
  );
}

export default Meet;

