import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";

import { v4 as uuid } from "uuid";
import { Socket } from "socket.io-client";

import BeforeJoin from "../components/BeforeJoin";
import AferJoin from "../components/AferJoin";
import { Config } from "../components/remoteVideo";
import { getCurrentUser, updateUserList } from "../utils/webrtcHandler";
import { useAppSelector } from "../redux/hooks";
import { room } from "../redux/roomReducer";

export interface streams {
  id: string;
  stream: MediaStream;
}

export type joinStatus = "loading" | "joined" | "error";

const pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: "59d18d15e0e0ab53643e84a2",
      credential: "RU6/Y/1oSqMGZ0YX",
    },
  ],
});

export type mainView = "local" | "remote";
export type userObject = {
  [socketId: string]: {
    pc: RTCPeerConnection | null;
    stream: MediaStream;
    username: string;
    userID: string;
    userType: string;
  };
};

const pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: "59d18d15e0e0ab53643e84a2",
      credential: "RU6/Y/1oSqMGZ0YX",
    },
  ],
};

let users: userObject = {};

function Meet() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    new MediaStream()
  );

  const [config, setConfig] = useState<Config>({ video: false, audio: false });

  const params = useParams();
  const roomID = params.id;

  const [enterRoom, setEnterRoom] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [joinStatus, setJoinStatus] = useState<joinStatus>("loading");
  const [mainView, setMainView] = useState<mainView>("local");

  const roomDetails: room = useAppSelector((state) => state.room);

  SocketConnect(setSocket, setError, setJoinStatus);

  useEffect(() => {
    socket?.on("userList", (data: userObject) => {
      updateUserList(data, users);
    });

    socket?.on("localDescription", async ({ description, from }) => {
      const pc = new RTCPeerConnection(pcConfig);
      users[from].pc = pc;

      console.log(description, { from: users[from].username });

      pc?.setRemoteDescription(description);

      pc.ontrack = (event) => {
        const track = event.track;
        console.log({ track: track.kind });

        const { stream } = users[from];
        if (!stream) users[from].stream = new MediaStream();

        users[from].stream.addTrack(track);
        console.log(
          users[from].stream.getAudioTracks()[0],
          users[from].stream.getVideoTracks()[0]
        );
      };

      socket?.on("iceCandidate", ({ candidate, from }) => {
        const pc = users[from].pc;
        console.log(`getting iceCandidate from ${users[from].username}`);
        pc?.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidateReply", { candidate, to: from });
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("remoteDescription", {
        description: pc.localDescription,
        to: from,
      });
    });

    socket?.on("remoteDescription", async ({ description, from }) => {
      console.log(from, users[from].pc);
      console.log(description);

      const pc = users[from].pc;

      pc?.setRemoteDescription(description);

      if (pc) {
        pc.ontrack = (e) => {
          const track = e.track;
          console.log({ track: track.kind });

          const { stream } = users[from];
          if (!stream) users[from].stream = new MediaStream();

          users[from].stream.addTrack(track);
          console.log(
            users[from].stream.getAudioTracks()[0],
            users[from].stream.getVideoTracks()[0]
          );
        };
      }

      socket?.on("iceCandidateReply", ({ candidate, from }) => {
        const pc = users[from].pc;
        pc?.addIceCandidate(candidate);
      });

      console.log("connection established");

      // pc.setRemoteDescription(description);

      //   pc.ontrack = (e) => {
      //     console.log(e.track);
      //     const video = e.track.enabled;
      //     const audio = e.track.enabled;
      //     setConfig({ video, audio });

      //     remoteStream?.addTrack(e.track);
      //     setRemoteStream((prevState) => {
      //       if (prevState) prevState.addTrack(e.track);
      //       return prevState;
      //     });
      //   };

      //   socket?.on("iceCandidate", ({ candidate }) => {
      //     pc.addIceCandidate(candidate);
      //   });

      //   pc.onicecandidate = ({ candidate }) => {
      //     socket?.emit("iceCandidateReply", { candidate });
      //   };
    });
  }, [socket, remoteStream]);

  async function join() {
    try {
      let currentUser = await getCurrentUser(users, roomDetails);

      let otherUsers = Object.fromEntries(
        Object.entries(users).filter(([socketId]) => socketId !== currentUser)
      );

      for (const [socketId, user] of Object.entries(otherUsers)) {
        const pc = new RTCPeerConnection(pcConfig);
        users[socketId].pc = pc;

        pc.onicecandidate = (e) => {
          const candidate = e.candidate;

          socket?.emit("iceCandidate", { candidate, to: socketId });
        };

        localStream?.getTracks().forEach((track) => {
          console.log(track);
          pc.addTrack(track, localStream);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        console.log(pc);

        socket?.emit("localDescription", {
          description: pc.localDescription,
          to: socketId,
        });
      }
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
          mainView={mainView}
          setMainView={setMainView}
          config={config}
          setConfig={setConfig}
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
