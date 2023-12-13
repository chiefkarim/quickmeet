import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { SetRoom } from "../redux/roomReducer";

export default function SocketConnect() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const roomID = params.id;
  const googleToken = localStorage.getItem("google-token")
  const user = JSON.parse(localStorage.getItem("userInformation") ?? "null")
  const roomDetails = useAppSelector(state => state.room)
  const dispatch = useAppDispatch()
  console.log("user", user)
  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);
      console.log(`Room details ${googleToken}`);
      if (googleToken != null) {
        if (roomDetails != null) {
          console.log("googletoken")
          const { userID, meetingID, roomType, role } = roomDetails
          if (role && role == "host") {
            if (roomID != roomDetails.roomID) {
              console.log("not the same")
              s.emit("join", { roomID, userID, userType: "registered", role: "attendee" })
            } else {

              s.emit("join", { roomID, userID, meetingID, roomType, role, userType: "registered" })
            }
          } else {
            console.log("lol")
            s.emit("join", { roomID, role: "attendee", userType: "registered", userID: user.user_id })
          }
        }

      } else {
        if (roomDetails != null) {
          const { userID, meetingID, roomType, role } = roomDetails
          if (role && role == "host") {
            console.log("geust not null")
            if (roomID != roomDetails.roomID) {
              console.log("not the same")
              s.emit("join", { roomID, userType: "guest", })
            } else {
              s.emit("join", { roomID, userID, meetingID, roomType, role, userType: "guest" })
            }
          } else {
            console.log("geust")
            s.emit("join", { userType: "guest", roomID })
          }
          console.log("here", roomDetails)

        }
      }
      s.on("join-response", ({ params: data }) => {
        console.log("join response", data)

        dispatch(SetRoom(data))
      })
      s.on("error", (error) => {
        console.log(error)
      })
      return () => s.disconnect();
    });

  }, []);
  return socket
}