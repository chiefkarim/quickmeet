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
        `http://localhost:3000/user/login?code=${code}`
      );
      const data = await response.json();

      if (response.status === 200) {
        console.log("user successfully logged In");
        localStorage.setItem("google-token", data.token);
        redirect();
      } else if (response.status === 500 || response.status === 400) {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    if (code && !token) {
      console.log(code);
      handleLogin();
    }
  });
  return (
    <>
      <a
        href={url}
        className="py-[10px] px-[50px]  border-purple border-2 rounded-[8px] "
      >
        Sign in
      </a>
    </>
  );
};

export { GoogleAuth };