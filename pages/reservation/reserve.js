
import { API_URL } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/cars"

export async function initReservation() {
    const data = await fetch(URL).then(handleHttpErrors)
    const tableRowsStr = data.map(car => `
        <tr>
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.pricePrDay}</td>
            <td><button id="${car.id}" class="btn btn-sm btn-secondary" data-bs-toggle='modal' data-bs-target='#reservation-modal'>Reserve</button></td>
        </tr>
    `).join("\n")
    const sanitized = sanitizeStringWithTableRows(tableRowsStr)
    const tableRows = document.getElementById("table-rows")
    tableRows.innerHTML = sanitized
    tableRows.addEventListener('click', async (e) => setupReservationModal(e))
}

const handleButton = async (id, username, date) => {
    if (username.value === "" || date.value === "" || id === "") return
    const status = document.getElementById("status")
    try {
        await fetch(API_URL + "/reservations", {
            method: "POST",
            body: JSON.stringify({
                username: username.value,
                carId: id,
                reservationDate: date.value,
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(handleHttpErrors)
        status.innerText = "Successfully reserved the car"
    } catch (err) {
        status.innerText = err.message
    }
}

async function setupReservationModal(event) {
    const username = document.getElementById("user-name")
    const date = document.getElementById("reservation-date")
    document.getElementById("btn-reservation").onclick = async () => await handleButton(event.target.id, username, date)
}

