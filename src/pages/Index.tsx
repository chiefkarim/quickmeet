import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import headerSVG from "../assets/images/header.svg"
import mobileSVG from "../assets/images/mobile.svg"
import desktop from "../assets/images/desktop.svg"
import privacySVG from "../assets/images/privacy.svg"
import transparencySVG from "../assets/images/transparency.svg"
import easySVG from "../assets/images/easy.svg"
import welcomeSVG from "../assets/images/welcome.svg"

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
    <section className="first text-center pb-20 pt-40">
      <div className="container ">
        <h1>Compatible With Any Device</h1>
        <div className="flex justify-between mt-20">
        <div className="left text-left">
          <p className="pl-[50px]" >Mobile</p>
          <img src={mobileSVG}/>
        </div>
        <div className="right -mr-[300px] text-left ">
          <p className="pl-[180px]">Desktop</p>
          <img src={desktop}/>
        </div>
        </div>
      </div>

    </section>
    <section className="second py-20">
      <div className="container flex justify-between items-center ">
        <div className="right -ml-[140px]">
          <img src={privacySVG}/>

        </div>
        <div className="left max-w-[525px] ">

          <h1>Privacy <br/>
No data is being saved</h1>
<p>trying to find a app that actually values your privacy and not sell your information behind your back? no problem.
if you don’t register nothing will be saved to our databases, yes nothing.
no messages no video no files!</p>
          
        </div>
      </div>
    </section>
    <section className="third py-20">
      <div className="container flex  justify-between items-center ">
        <div className="left max-w-[525px] ">

          <h1>Transparency & care<br/>
we are completely open source</h1>
<p>ever had that feeling where you really like the app but it’s missing one feature that you absolutely need?
the project is completely open source witch means you can see what we are doing behind the curtains.
and if you want a feature you can request it.</p>
          
        </div>
        <div className="right -mr-[140px]">
          <img src={transparencySVG}/>

        </div>
      </div>
    </section>
    <section className="forth py-20">
      <div className="container flex justify-between items-center ">
        <div className="right -ml-[140px]">
          <img src={easySVG}/>

        </div>
        <div className="left max-w-[525px] ">

          <h1>Fast & Easy<br/>
One click setup</h1>
<p>tiered of all the long forms and applications asking you for your credit card? no problem.
You don’t even have to register.
just drop the link and join a call, or create new one 
right now.</p>
          
        </div>
      </div>
    </section>
    <section className="fifth py-20">
      <div className="container flex  justify-between items-center ">
        <div className="left max-w-[525px] ">
          <h1>Get started right now </h1>
          <div className="mt-[80px]">
          <button className="bg-green text-white  px-[54px] py-[11px] mr-[40px]">Register</button>
          <button className="bg-transparent border-2 px-[45px] py-[11px] border-green text-green">New Meeting</button>
          </div>
        </div>
        <div className="right -mr-[140px]">
          <img src={welcomeSVG}/>

        </div>
      </div>
    </section>
    <section>
        <Footer/>
    </section>
    </div>)
}
export default Index