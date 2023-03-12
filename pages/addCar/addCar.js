
import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
//Add id to this URL to get a single user
const URL = `${API_URL}/cars`

const postCar = async (carInfo) => {
    return await fetch(URL, {
        method: "POST",
        body: JSON.stringify(carInfo),
        headers: {
            "Content-type": "application/json"
        }
    }).then(handleHttpErrors)
}

const handleFormSubmit = async (event, form) => {
    event.preventDefault()
    const status = document.getElementById("status")
    const brand = form.brand
    const model = form.model
    const pricePrDay = form.pricePrDay
    const bestDiscount = form.bestDiscount
    const body = {
        brand: brand.value,
        model: model.value,
        pricePrDay: pricePrDay.value,
        bestDiscount: bestDiscount.value
    }
    try {
        await postCar(body)
        window.location.href = "/#/cars"
        form.reset()
    } catch (e) {
        status.innerText = `${e.message}`
    }
}

export async function initAddCar() {
    const form = document.getElementById("form")
    form.onsubmit = (e) => handleFormSubmit(e, form)
}
