
async function  CreateMeeting (){
    const url = import.meta.env.VITE_BACKEND_URL;

        const response =await fetch(url,{method:'POST'})
        const data = await response.json()
        if(data.roomID){
            localStorage.setItem("roomDetails",JSON.stringify(data))
        }
        console.log(localStorage.getItem("roomDetails"))
    return (<></>)
}
export default CreateMeeting