import { API_URL } from "../../settings.js";
import { storeLoginDetails } from "../../utils.js";
const URL = API_URL + "/auth/login";

const handleLogin = async () => {
  const passwordInput = document.getElementById("password");
  const usernameInput = document.getElementById("username");

  if (passwordInput.value === "" || usernameInput.value === "") return;

  const body = {
    username: usernameInput.value,
    password: passwordInput.value,
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await res.json();
    if (res.status === 200) {
      storeLoginDetails(data);
      window.location.href = "/";
      document.getElementById("nav-signup-btn").remove();
    }
  } catch (err) {
    console.log(err);
  }
};
export function initLogin() {
  document.getElementById("login-btn").onclick = async () => handleLogin();
}
