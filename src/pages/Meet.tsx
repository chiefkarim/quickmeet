import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import LocalCam from "../components/LocalCam";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
function Meet() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const roomID = params.id;
  const googleToken = localStorage.getItem("google-token")
  const roomDetails = JSON.parse(localStorage.getItem("roomDetails") || "null")
  const [cam, ] = useState<boolean>(false);
  const [audio, ] = useState<boolean>(false)
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

  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-extra-light-grey">
              <LocalCam camera={cam} mice={audio}/>
            </div>
            <div className=" flex gap-[1rem] w-full justify-between ">
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey "></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-extra-light-grey"></div>
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
}
export default Meet;
