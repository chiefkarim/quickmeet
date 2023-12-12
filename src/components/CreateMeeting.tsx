import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { SetRoom } from "../redux/roomReducer";

const CreateMeeting = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const googleToken = localStorage.getItem("google-token");
  const navigate = useNavigate();
  let response;
  let params = {};
  const room = useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();
  const createMeet = async () => {
    if (
      googleToken != null &&
      localStorage.getItem("userInformation") != null
    ) {
      const userInformation = JSON.parse(
        localStorage.getItem("userInformation") || ""
      );
      params = {
        method: "POST",
        headers: {
          authorization: googleToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userInformation["user_id"] }),
      };
    } else {
      params = { method: "POST" };
    }

    try {
      response = await fetch(url + "/meet/create", params);
    } catch (error) {
      console.log(error);
      return;
    }
    const data = await response.json();

    if (data.roomID) {
      if (localStorage.getItem("userInformation") != null) {
        const userInformation = JSON.parse(
          localStorage.getItem("userInformation") || data.userID
        );
        data.userID = userInformation["user_id"];
      }
      localStorage.setItem("roomDetails", JSON.stringify(data));
      dispatch(SetRoom(data));
      console.log("room", room);

      navigate(`/meet/${data.roomID}`);
    }
  };

  return (
    <>
      <button
        onClick={createMeet}
        className="bg-green  text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white"
      >
        New Meeting
      </button>
    </>
  );
};
export default CreateMeeting;
