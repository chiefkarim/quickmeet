import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import headerSVG from "../assets/images/header.svg"
import mobileSVG from "../assets/images/mobile.svg"
import desktop from "../assets/images/desktop.svg"
import privacySVG from "../assets/images/privacy.svg"

function Index(){
    return (<div>
    <section className="max-h-[636px] header">
      <Navbar />
<div className="container pt-[30px]">
<div className="flex justify-between ">
  <div className="left max-w-[432px]">
  <h1 className="">Join or start a conference call with just one click</h1>
  <p className=" opacity-[0.8] text-black">no need to create an account just drop the link and join a meeting or create new one instantly and your information won’t be saved.</p>
  <div className="flex items-center mt-[70px] gap-[30px]">
<button className="bg-green text-[14px] px-[18px] py-[11px] text-white">New Meeting</button> 
<input type="text" className="border-2 text-[14px] px-[18px] py-[11px]" placeholder="Enter Link"/>
<a href="#" className="text-light-grey">Join</a> 
  </div>
  </div>
  <div className="right -mr-[140px]">
  <img src={headerSVG} className=""/>
  </div>
</div>
  </div>
    </section>
   
    </div>)
}
export default Index