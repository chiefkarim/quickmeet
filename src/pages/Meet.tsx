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
  const roomDetails = JSON.parse(localStorage.getItem("roomDetails") || "null")
  const {userID,meetingID,roomType,role} = roomDetails
  const [cam, ] = useState<boolean>(false);
  const [audio, ] = useState<boolean>(false)
  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);
      console.log(roomDetails)
      
      s.emit("join-host", { roomID ,userID ,meetingID ,roomType ,role})
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
