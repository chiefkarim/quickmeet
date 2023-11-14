import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessagingBoard from "../components/MessagingBoard"

function Meet(){
    return (<div>
        
        <section className="px-[60px]">
        <Navbar />    
            <div className="container  flex gap-[1.88rem] justify-between ">
            <div className="flex flex-col gap-[1.88rem]">

                <div className="w-[55.1875rem] h-[25.125rem]  bg-off-white">

                </div>
                <div className=" flex gap-[2.31rem]">

                <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white">

                </div>
                <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white">

                </div>
                <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white">

                </div>
                <div className="w-[12.0625rem] h-[6.4375rem] bg-off-white">

                </div>
                </div>
            </div>
            <MessagingBoard/>
            </div>
        </section>
        <section>
            <Footer/>
        </section>
    </div>)
}
export default Meet