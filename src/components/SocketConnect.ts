import { useEffect, } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { SetRoom } from "../redux/roomReducer";
import { room } from "../redux/roomReducer";

export default function SocketConnect(setSocket: (socket: Socket | null) => void) {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const googleToken = localStorage.getItem("google-token")
  const roomDetails: room = useAppSelector(state => state.room)
  const dispatch = useAppDispatch()
  const roomID = params.id
  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);
      
      if (googleToken != null) {
        const user = JSON.parse(localStorage.getItem("userInformation") || "null");
        if (roomDetails.roomID != null) {
          
          const { userID, meetingID, roomType, role, userType, username, roomID } = roomDetails
          if (role && role == "host") {
            if (roomID != roomDetails.roomID) {
              
              s.emit("join", { roomID, userID, role: "attendee", userType, username })
            } else {
              s.emit("join", { roomID, userID, meetingID, roomType, role, userType, username })
            }
          }
        } else {
          const { username } = user
          const userID = user.user_id

          s.emit("get-room", { userID, username, roomID, userType: "registered" })
          s.on("get-room", (roomDetails) => {
            const { userID, meetingID, roomType, role, userType, username, roomID } = roomDetails

            SetRoom(roomDetails)
            s.emit("join", { userID, meetingID, roomType, role, userType, username, roomID })
          })

        }

      } else {

        if (roomDetails.roomID != null) {
          const { userID, meetingID, roomType, role, userType, username, roomID } = roomDetails
          if (role && role == "host") {
            
            if (roomID != roomDetails.roomID) {
              

              s.emit("join", { roomID, userType: "guest", })
            } else {
              
              s.emit("join", { userID, meetingID, roomType, role, userType, username, roomID })
            }

          }
        } else {
          

          s.emit("create-guest", { username: "karim" })
          s.on("create-guest", (guestInfo) => {
            const { username } = guestInfo
            const userID = guestInfo.guest_id
            guestInfo.userID = userID

            localStorage.setItem("userInformation", JSON.stringify(guestInfo))

            s.emit("get-room", { userID, username, roomID, userType: "guest" })
            s.on("get-room", (roomDetails) => {
              const { userID, meetingID, roomType, role, userType, username, roomID } = roomDetails

              SetRoom(roomDetails)
              s.emit("join", { userID, meetingID, roomType, role, userType, username, roomID })
            })
          })
        }
      }
      s.on("join-response", ({ params: data }) => {
        

        dispatch(SetRoom(data))
      })
      s.on("error", (error) => {
        console.log(error)
      })
      return () => s.disconnect();
    });

  }, []);

}