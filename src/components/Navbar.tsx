import logo from "../assets/images/Logo.svg";
import { GoogleAuth } from "./GoogleAuth";

function Navbar() {
  return (
    <nav>
      <div className="container h-[93px] text-[18px]  items-center flex   justify-between">
        <a href="/">
          <img src={logo} />
        </a>
        <div className="flex gap-[40px]">
          <a href="/" className="mt-[12px]">
            Home
          </a>
          <a href="#footer" className="mt-[12px] ">
            Contact
          </a>
          <GoogleAuth />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
