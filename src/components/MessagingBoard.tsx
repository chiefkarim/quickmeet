import easy from "../assets/images/easy.svg"
import send from "../assets/images/send.svg"
import uploadPhoto from "../assets/images/photo.svg"

function MessagingBoard(){
    return (
        <div className= "w-[20.4375rem] h-[33.4375rem] bg-off-white flex flex-col justify-between">
            <div className="messages rounded-[8px] my-[1.38rem] mx-[0.38rem]  flex  ">
                <img src={easy} className="h-[2.7rem] w-[2.7rem] inline-block rounded-[16px] mx-[1rem] "/>
                <div className=" bg-white w-[13.9375rem] py-[0.56rem] px-[0.81rem] inline-block mt-[1.35rem]">
                    <p className="text-[0.8125rem] opacity-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className="text-[0.625rem] text-light-grey opacity-[0.8] block text-end ">time</p>
                </div>
            </div>
            <div className="userInputMessage relative m-[1.38rem] rounded-[8px] ">
                <input type="text" className="w-[17.6875rem] h-[2.75rem]"/>
                <button className="absolute top-0 " >
                    <img src={uploadPhoto}/>
                </button>
                <button className="absolute top-0 right-0">
                    <img src={send}/>
                </button>
            </div>
        </div>
    )
}
export default MessagingBoard