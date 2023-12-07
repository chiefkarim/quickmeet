import { useNavigate } from "react-router-dom";

const  CreateMeeting=()=>{
    const url = import.meta.env.VITE_BACKEND_URL;
    const googleToken =  localStorage.getItem("google-token")
    const navigate = useNavigate()
    let response;
    let params={}

    const createMeet=async()=>{
        if(googleToken != null && localStorage.getItem("userInformation") != null){
            const userInformation = JSON.parse(localStorage.getItem("userInformation") || "")
            params = {method:'POST',headers:{authorization:googleToken,'Content-Type': 'application/json'},body:JSON.stringify({userID:userInformation["user_id"]})}
        }else{
            params = {method:'POST'}
        }
        
        try{
            response =await fetch(url+"/meet/create",params)
        }catch(error){
            console.log(error)
            return 
        }
            const data = await response.json()
            
            if(data.roomID){
                if(localStorage.getItem("userInformation") != null){
                    const userInformation = JSON.parse(localStorage.getItem("userInformation") || data.userID)
                    data.userID = userInformation["user_id"]
                }
                localStorage.setItem("roomDetails",JSON.stringify(data))
                console.log(localStorage.getItem("roomDetails"))
                navigate(`/meet/${data.roomID}`)
            }
    }
        createMeet();
   
    

    
    return (<>
    <button onClick={createMeet} className="bg-green  text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white">
                  New Meeting
                </button>
    </>)
}
export default CreateMeeting