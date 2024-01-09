import { useEffect } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { SetRoom } from "../redux/roomReducer";
import { room } from "../redux/roomReducer";

export default function SocketConnect(
  setSocket: (socket: Socket | null) => void
) {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const googleToken = localStorage.getItem("google-token");
  const guestUser = JSON.parse(
    localStorage.getItem("guestInformation") || "null"
  );

  const roomDetails: room = useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();

  const roomID = params.id;
  let userType: string, userID: string, username: string;
  if (googleToken) {
    const user = JSON.parse(localStorage.getItem("userInformation") || "null");
    userType = "registered";
    userID = user.user_id;
    username = user.username;
  } else {
    (userType = "guest"),
      (username = guestUser.username),
      (userID = guestUser.userID);
  }

  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);

      if (roomDetails.roomID === null) {
        s.emit("get-room", { roomID, userType, userID, username });
        s.on("get-room", (roomDetails) => {
          console.log(roomDetails);
          dispatch(SetRoom(roomDetails));
        });
      } else if (roomDetails.roomID !== null) {
        const {
          userID,
          meetingID,
          roomType,
          role,
          userType,
          username,
          roomID,
        } = roomDetails;
        s.emit("join", {
          userID,
          meetingID,
          roomType,
          role,
          userType,
          username,
          roomID,
        });

        s.on("error", (error) => {
          console.log(error);
        });
        return () => s.disconnect();
      }
    });
  }, [roomDetails]);
}
