
async function  CreateMeeting (){
    const url = import.meta.env.VITE_BACKEND_URL;
    const googleToken =  localStorage.getItem("google-token")
    let response
if (googleToken != null && localStorage.getItem("userInformation") != null){
    const userInformation = JSON.parse(localStorage.getItem("userInformation") || "")
response =await fetch(url+"/meet/create",{method:'POST',headers:{authorization:googleToken,'Content-Type': 'application/json'},body:JSON.stringify({userID:userInformation["user_id"]})})

}else{

     response =await fetch(url+"/meet/create",{method:'POST'})
}
        const data = await response.json()
        
        if(data.roomID){
            if(localStorage.getItem("userInformation") != null){
                const userInformation = JSON.parse(localStorage.getItem("userInformation") || data.userID)
                data.userID = userInformation["user_id"]
            }
            localStorage.setItem("roomDetails",JSON.stringify(data))
        }
        console.log(localStorage.getItem("roomDetails"))
    return (<></>)
}
export default CreateMeeting