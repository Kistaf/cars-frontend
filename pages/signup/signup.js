import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"


const URL = API_URL + "/members"

const handleRegister = async (event, form) => {
    event.preventDefault()
    const username = form.inputUsername.value
    const email = form.inputEmail.value
    const password = form.inputPassword.value
    const firstName = form.inputFirstname.value
    const lastName = form.inputLastname.value
    const street = form.inputStreet.value
    const city = form.inputCity.value
    const zip = form.inputZip.value


    const status = document.getElementById("status")

    try {
        await fetch(URL, {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
                firstName,
                lastName,
                street,
                city,
                zip
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(handleHttpErrors)
        form.reset()
        window.location.href = "/#/login"
    } catch (err) {
        status.innerText = err.message
    }
}

export async function initSignup() {
    const form = document.getElementById("form")
    form.onsubmit = (e) => handleRegister(e, form)
}


