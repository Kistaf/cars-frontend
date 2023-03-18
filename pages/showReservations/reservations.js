import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

const handleReservations = async () => {
  // const username = document.getElementById("member-username")
  // if (username.value === "") return
  const user = localStorage.getItem("user");
  if (user === undefined || user === null) {
    document.getElementById("error").innerText = "You are not logged in!";
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const resData = await fetch(API_URL + `/members/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(handleHttpErrors);
    const rowsStr = await Promise.all(
      resData.reservations.map(async (res) => {
        const car = await fetch(API_URL + `/cars/${res.carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(handleHttpErrors);
        return `
                <tr>
                    <td>${res.carId}</td>
                    <td>${car.brand}</td>
                    <td>${car.model}</td>
                    <td>${res.reservationDate}</td>
                    <td>${car.pricePrDay}</td>
                </tr>
            `;
      })
    );
    const tableRowsStr = rowsStr.join("\n");
    const sanitized = sanitizeStringWithTableRows(tableRowsStr);
    document.getElementById("error").innerText = "";
    document.getElementById("tablerows").innerHTML = sanitized;
  } catch (err) {
    document.getElementById("tablerows").innerHTML = DOMPurify.sanitize("");
    document.getElementById("error").innerText = err.message;
  }
};

export async function initListReservationsAll() {
  handleReservations();
  //   document.getElementById("btn-fetch-member-reservations").onclick = async () =>
  //     handleReservations();
}
