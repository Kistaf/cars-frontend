import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";

// temp - once security is implemented this endpoint is not needed
const URL = API_URL + "/cars/admin";

export async function initCars() {
  const data = await fetch(URL).then(handleHttpErrors);
  const tableRowsStr = data
    .map(
      (car) => `
        <tr>
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.pricePrDay}</td>
            <td>${car.bestDiscount}</td>
        </tr>
    `
    )
    .join("\n");
  document.getElementById("table-rows").innerHTML =
    sanitizeStringWithTableRows(tableRowsStr);
}
