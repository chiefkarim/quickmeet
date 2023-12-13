import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import Video from "../components/Video";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";
import Navbar from "../components/Navbar";
interface streams {
  id: string,
  stream: MediaStream
}

function Meet() {
  const [streams, setStreams] = useState<streams[]>([]);
  const params = useParams();
  const roomID = params.id;
  const [enterRoom, setEnterRoom] = useState<boolean>(false)
  const socket = SocketConnect()
  const [localStreamId, setLocalStreamId] = useState<string | null>(null)
  const localStream = streams.find(item => item.id === localStreamId)?.stream || null

  function updateStream(action: string, stream: MediaStream, id: string) {

    if (action === "set") {

      const newStreams = streams.map((item) => {
        if (item.id === id) {
          return { id, stream }
        }
        return item
      })
      setStreams(() => { return newStreams })
    } else if (action === "setLocal") {
      setLocalStreamId(id)

      if (streams.filter((stream) => stream.id === id).length != 0) {

        const newStreams = streams.map((item) => {
          if (item.id === id) {
            return { id, stream }
          } else {
            return item
          }
        })
        setStreams(() => { return newStreams })
      } else {
        setLocalStreamId(id)

        setStreams((streams) => { return [...streams, { id, stream }] })

      }
    } else if (action === "add") {

      setStreams((streams) => [...streams, { id, stream }])
    } else if (action === "remove" && id) {

      const newStreams = streams.filter((item) => item.id !== id)
      setStreams(newStreams)
    }
  }
  // clean up media tracks
  useEffect(() => {
    return () => {
      if (streams) {
        streams.forEach((stream) => stream.stream.getTracks().forEach((track) => track.stop()))
      }
    };
  }, [streams])

  function join() {
    setEnterRoom(true)
  }
  if (enterRoom === false) {


    return (<>
      <Navbar />
      <section className="pt-0 mt-0 flex flex-col items-center justify-center ">
        <div className="bg-white   ">
          <div className="relative localCam h-[70vh] ">
            <Video id={null} Stream={localStream} autoRun={true} updateStream={updateStream} />

          </div >
          <div className="mt-[30px] flex justify-center">
            <button onClick={join} className="bg-green   text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white">join room</button>
          </div>
        </div>
      </section>
    </>
    );
  } else {
    return (<div className="bg-white pt-5 ">
      <section className="px-0">
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-extra-light-grey">
              <Video id={localStreamId} Stream={localStream} autoRun={false} updateStream={updateStream} />
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
    )
  }
}
export default Meet;
