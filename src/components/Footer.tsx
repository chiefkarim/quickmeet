import logo from "../assets/images/Logo.svg"

function Footer(){
    return (<footer><div id="footer" className="container">
        <a>
            <img src={logo}/>
        </a>
        <a href="">Github</a>
        <a href="" >Email</a>
        <a href="">Twitter</a>
    </div></footer>)
}
export default Footer