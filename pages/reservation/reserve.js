import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
const URL = API_URL + "/cars";

export async function initReservation() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("user");
  if (
    username === undefined ||
    username === null ||
    token === undefined ||
    token === null
  ) {
    document.getElementById("error").innerText =
      "You must be logged in to reserve a car!";
    return;
  }
  const data = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleHttpErrors);
  const tableRowsStr = data
    .map(
      (car) => `
        <tr>
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.pricePrDay}</td>
            <td><button id="${car.id}" class="btn btn-sm btn-secondary" data-bs-toggle='modal' data-bs-target='#reservation-modal'>Reserve</button></td>
        </tr>
    `
    )
    .join("\n");
  const sanitized = sanitizeStringWithTableRows(tableRowsStr);
  const tableRows = document.getElementById("table-rows");
  tableRows.innerHTML = sanitized;
  tableRows.addEventListener("click", async (e) => setupReservationModal(e));
}

const handleButton = async (id, date) => {
  // if (username.value === "" || date.value === "" || id === "") return
  const username = localStorage.getItem("user");
  if (username === undefined || username === null) {
    document.getElementById("modal-error").innerText = "Something went wrong!";
    return;
  }
  const status = document.getElementById("status");
  try {
    const token = localStorage.getItem("token");
    await fetch(API_URL + "/reservations", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        carId: id,
        reservationDate: date.value,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(handleHttpErrors);
    status.innerText = "Successfully reserved the car";
  } catch (err) {
    status.innerText = err;
  }
};

async function setupReservationModal(event) {
  // const username = document.getElementById("user-name")
  const date = document.getElementById("reservation-date");
  document.getElementById("btn-reservation").onclick = async () =>
    await handleButton(event.target.id, date);
}
