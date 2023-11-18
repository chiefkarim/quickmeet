

import logo from "../assets/images/Logo.svg";

function SideBar(){
    return(<div className="pl-[1rem]">
        <a href="/" >
          <img src={logo} className=" h-[50px]"/>
        </a>
        </div>)
}
export default SideBar