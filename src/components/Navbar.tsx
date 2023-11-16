import logo from "../assets/images/Logo.svg";
import { GoogleAuth } from "./GoogleAuth";

function Navbar() {
  return (
    <nav>
      <div className="container  h-[93px] tablet:h-[60px] text-[18px] tablet:text-[14px]  items-center flex   justify-between">
        <a href="/">
          <img src={logo} />
        </a>
        <div className="flex gap-[40px]">
          <a href="/" className="mt-[12px] tablet:mt-[5px]">
            Home
          </a>
          <a href="#footer" className="mt-[12px] tablet:mt-[5px]">
            Contact
          </a>
          <GoogleAuth />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
