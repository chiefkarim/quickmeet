import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

export default function SocketConnect() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const roomID = params.id;
  const googleToken = localStorage.getItem("google-token")
  const roomDetails = JSON.parse(localStorage.getItem("roomDetails") || "null")

  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);
      console.log(`Room details ${googleToken}`);
      if (googleToken != null) {
        if (roomDetails != null) {
          const { userID, meetingID, roomType, role } = roomDetails
          if (role && role == "host") {
            if (roomID != roomDetails.roomID) {
              console.log("not the same")
              s.emit("join", { roomID, userID,userType:"registered", role: "attendee" })
            } else {
              
              s.emit("join", { roomID, userID, meetingID, roomType, role, userType:"registered" })
            }
          }

        } else {
          console.log("lol")
          const userInformation = JSON.parse(localStorage.getItem("userInformation") || "null")
          s.emit("join", { roomID, role: "attendee", userType:"registered", userID: userInformation.user_id })
        }
      } else {
        if(roomDetails != null ){
          const { userID, meetingID, roomType, role } = roomDetails
          console.log("geust not null")
          if (role && role == "host") {
            if (roomID != roomDetails.roomID) {
              console.log("not the same")
              s.emit("join", { roomID,userType:"guest", })
            } else {
              s.emit("join", { roomID, userID, meetingID, roomType, role, userType:"guest" })
            }
          }

        }else{
          console.log("geust")

          s.emit("join", { userType: "guest", roomID })
        }
        


      }
      s.on("join-response", ({params:data}) => {
        console.log("join response",data)
        localStorage.setItem("roomDetails", JSON.stringify(data))
      })
      s.on("error", (error) => {
        console.log(error)
      })
      return () => s.disconnect();
    });

  }, []);
  return socket
}