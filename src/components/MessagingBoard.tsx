import easy from "../assets/images/easy.svg";
import send from "../assets/images/send.svg";
import uploadPhoto from "../assets/images/photo.svg";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface MessagingBoard {
  socket: Socket | null;
  roomID: string | undefined;
}

const MessagingBoard: React.FC<MessagingBoard> = ({ socket, roomID }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [yourMessage, setYourMessage] = useState<string>();

  useEffect(() => {
    socket?.on("msg-to-client", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (yourMessage) {
      socket?.emit("msg-to-server", { message: yourMessage, roomID: roomID });
    }
  };

  const handleChange = (e: any) => {
    setYourMessage(e.target.value);
  };

  return (
    <div className=" h-stretch bg-off-white flex flex-col overflow-hidden justify-between">
      <div className="messages rounded-[8px] my-[1.38rem] ml-[0.38rem] mr-[1rem] flex  ">
        <img
          src={easy}
          className="h-[2.7rem] w-[2.7rem] inline-block rounded-[16px] mx-[1rem] "
        />
        <div className=" bg-white w-full py-[0.56rem] px-[0.81rem] inline-block mt-[1.35rem]">
          <p className="text-[0.8125rem] opacity-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p className="text-[0.625rem] text-light-grey opacity-[0.8] block text-end ">
            time
          </p>
          {messages &&
            messages.map((message) => (
              <li key={crypto.randomUUID()} className="text-black text-lg">
                {message}
              </li>
            ))}
        </div>
      </div>
      <div className="userInputMessage  relative m-[1.38rem] rounded-[8px] ">
        <input
          type="text"
          className="w-full h-[2.75rem]"
          onChange={(e) => handleChange(e)}
        />
        <button className="absolute top-0 left-0 bg-transparent">
          <img src={uploadPhoto} />
        </button>
        <button
          className="send-message absolute top-0 right-0 bg-transparent "
          onClick={sendMessage}
        >
          <img src={send} />
        </button>
      </div>
    </div>
  );
};
export default MessagingBoard;
