import Footer from "../components/Footer";
import MessagingBoard from "../components/MessagingBoard";
import LocalCam from "../components/LocalCam";

function Meet() {

  return (
    <div className="bg-white pt-5 ">
      <section className="px-0">
      
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
        
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
          
            <div className="localVideo tablet:w-auto w-[65vw]   min-h-[75vh] relative bg-off-white">
              <LocalCam/>
            </div>
            <div className=" flex gap-[1rem] w-full justify-between ">
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white ">

              </div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
              <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white"></div>
            </div>
          </div>
          <MessagingBoard />
        </div>
      </section>
      <section className="px-[3rem] " >
        <Footer  />
      </section>
    </div>
  );
}
export default Meet;
