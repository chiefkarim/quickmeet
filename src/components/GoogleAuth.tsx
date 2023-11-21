import { getGoogleUrl } from "../utils/getGoogleUrls";
import { useState } from "react";

const GoogleAuth = () => {
  const token = localStorage.getItem("google-token");
  const url = getGoogleUrl();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const redirect = () => {
    setInterval(() => {
      window.location.href = "/";
    }, 4000);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `https://quickmeet.centralindia.cloudapp.azure.com/user/login?code=${code}`
      );
      const data = await response.json();

      if (response.status === 200) {
        alert("user successfully logged In");
        localStorage.setItem("google-token", data.token);
        redirect();
      } else if (response.status === 500 || response.status === 400) {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    // remove token from local storage
  };

  useState(() => {
    if (code && !token) {
      handleLogin();
    }
  });
  return (
    <>
      {token ? (
        <a
          onClick={logout}
          className="py-[10px] px-[50px] tablet:px-[30px] mobile:text-white border-purple border-2 rounded-[8px] "
        >
          logout
        </a>
      ) : (
        <a
          href={url}
          className="py-[10px] px-[50px] tablet:px-[30px] mobile:px-0 mobile:text-white tablet:py-[4px] border-purple border-2 rounded-[8px] "
        >
          Sign in
        </a>
      )}
    </>
  );
};

export { GoogleAuth };
