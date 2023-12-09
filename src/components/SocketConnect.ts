import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

export default function SocketConnect(){
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
        if(googleToken != null){
          const {userID,meetingID,roomType,role} = roomDetails
        if(role && role == "host"){
          if(roomID != roomDetails.roomID){
            s.emit("join", { roomID ,userID ,meetingID ,roomType ,role:"attendee"})
          }else{
            s.emit("join", { roomID ,userID ,meetingID ,roomType ,role})
          }
        }        
  
        }else{
          if(roomDetails!=null){
            const {role,userID,meetingID,roomType} = roomDetails
    console.log(role,userID,meetingID)
    s.emit("join", { role,userID,roomID,userType:"guest",meetingID,roomType })
  
          }else{
            //get the userID and save it incase of a disconnection and use it to reconnect
            s.emit("join", { userType:"guest",roomID })
            
          }
          s.on("join-response", (data)=>{
            console.log(data)
            localStorage.setItem("roomDetails",JSON.stringify(data))
          })
          s.on("error",(error)=>{
            console.log(error)
        })
      }
      return () => s.disconnect();
    });
  
    }, []);
    return socket
}