import easy from "../assets/images/easy.svg";
import avatar from "../assets/images/Avatar.svg";
import send from "../assets/images/send.svg";
import uploadPhoto from "../assets/images/photo.svg";
import { FormEvent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { room } from "../redux/roomReducer";

interface MessagingBoard {
  socket: Socket | null;
  roomID: string | undefined;
}

interface chatParams {
  userID: string | null;
  message: string | undefined;
  username: string | null;
  time: string;
}

const formatDate = (time: string) => {
  const date = new Date(time);
  let formattedTime = date.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return formattedTime;
};

const MessagingBoard: React.FC<MessagingBoard> = ({ socket, roomID }) => {
  const [chatData, setChatData] = useState<chatParams[]>([]);
  const [yourMessage, setYourMessage] = useState<string>();
  const roomDetails: room = useAppSelector((state) => state.room);

  useEffect(() => {
    socket?.on("msg-to-client", (params: chatParams) => {
      params.time = formatDate(params.time);
      setChatData((chatData) => [...chatData, params]);
    });

    if (roomDetails) {
      socket?.on("all-messages", (params) => {
        params.time = formatDate(params.time);
        setChatData(params.messages);
      });
    }
  }, [socket, roomDetails]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString("en-US", {
      timeStyle: "short",
    });

    if (yourMessage) {
      const response = await socket
        ?.timeout(5000)
        .emitWithAck("msg-to-server", { message: yourMessage, roomID: roomID });

      if (response.status) {
        setChatData([
          ...chatData,
          {
            userID: roomDetails.userID,
            message: yourMessage,
            time: currentTime,
            username: roomDetails.username,
          },
        ]);
      }
    }
  };

  const handleChange = (e: any) => {
    setYourMessage(e.target.value);
  };

  return (
    <div className=" max-h-[90vh] bg-extra-light-grey w-full  flex flex-col overflow-hidden justify-between">
      <div className="messages rounded-[8px] my-[1.38rem] ml-[0.38rem] mr-[1rem] flex flex-col overflow-scroll">
        {chatData &&
          chatData.map((chat) => (
            <div
              className={`message m-[0.5rem] flex items-center ${
                chat.userID == roomDetails.userID ? "flex-row-reverse" : ""
              } `}
              key={crypto.randomUUID()}
            >
              <img src={avatar} className="h-6 w-6 rounded-[16px] mx-[1rem] " />
              <div className="flex flex-col ">
                <span
                  className={`text-[0.81rem] mb-1 inline-block text-black ${
                    chat.userID == roomDetails.userID ? "text-end" : ""
                  }`}
                >
                  {chat.userID == roomDetails.userID ? "You" : chat.username}
                </span>
                <div className="msg-body bg-white w-full py-[0.56rem] min-w-[100px] px-[0.81rem] rounded-br-lg max-w-xs">
                  <p className="text-[0.8125rem] opacity-100">
                    {chat.message}{" "}
                  </p>
                  <p className="text-[0.625rem] text-light-grey opacity-[0.8] block text-end">
                    {chat.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="userInputMessage relative m-[1.38rem] rounded-[8px] border-none ">
        <form onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            className="w-full h-[2.75rem] border-none px-[40px]"
            onChange={(e) => handleChange(e)}
          />
          <button className="absolute px-2 top-0 left-0 bg-opacity-0 bg-transparent border-none">
            <img src={uploadPhoto} />
          </button>
          <button
            type="submit"
            className="send-message px-2 absolute top-0 right-0 bg-transparent border-none"
          >
            <img src={send} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default MessagingBoard;
