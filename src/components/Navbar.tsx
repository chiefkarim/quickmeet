import logo from "../assets/images/Logo.svg"


function Navbar(){
    return (<nav><div className="container h-[93px] text-[18px]  items-center flex   justify-between">
        <a href="/">
          <img src={logo}/>
        </a>
        <div className="flex gap-[40px]">
    <a href="/" className="mt-[12px]">Home</a>
    <a href="#footer" className="mt-[12px] ">Contact</a>
    <a href="#" className="mt-[12px]">Sign in</a>
    <a href="#" className="py-[10px] px-[50px]  border-purple border-2 rounded-[8px] ">Sign up</a>
    </div>
    </div></nav>)
}
export default Navbar