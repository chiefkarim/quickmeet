
async function  CreateMeeting (){
    
        const response =await fetch("http://localhost:3000/meet/create",{method:'POST'})
        const data = await response.json()
        if(data.roomID){
            localStorage.setItem("roomDetails",JSON.stringify(data))
        }
        console.log(localStorage.getItem("roomDetails"))
    return (<></>)
}
export default CreateMeeting