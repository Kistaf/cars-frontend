import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`;

const handleFetch = async (url, options = undefined) => {
  return await fetch(url, options).then(handleHttpErrors);
};

const populateEditForm = (data) => {
  document.getElementById("car-id").value = data.id;
  document.getElementById("brand").value = data.brand;
  document.getElementById("model").value = data.model;
  document.getElementById("pricePrDay").value = data.pricePrDay;
  document.getElementById("bestDiscount").value = data.bestDiscount;
};

const fetchAndPopulateCar = async () => {
  const idField = document.getElementById("car-id-input");
  const token = localStorage.getItem("token");
  if (!token) return;

  if (idField.value === "") return;
  try {
    const data = await handleFetch(URL + `/admin/${idField.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    populateEditForm(data);
    document.getElementById("fetch-status").innerText =
      "Car fetched and fields populated";
  } catch (err) {
    document.getElementById("fetch-status").innerText = err.message;
  }
};

const handleSubmitChange = async () => {
  const id = document.getElementById("car-id");
  const token = localStorage.getItem("token");
  if (!token) return;
  if (id.value === "") return;
  const brand = document.getElementById("brand");
  const model = document.getElementById("model");
  const pricePrDay = document.getElementById("pricePrDay");
  const bestDiscount = document.getElementById("bestDiscount");
  const body = {
    id: id.value,
    brand: brand.value,
    model: model.value,
    pricePrDay: pricePrDay.value,
    bestDiscount: bestDiscount.value,
  };
  const status = document.getElementById("status");
  try {
    await handleFetch(URL, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    status.innerText = "Successfully updated car";
  } catch (err) {
    status.innerText = err.message;
  }
};

const handleDeleteCar = async () => {
  const id = document.getElementById("car-id");
  const token = localStorage.getItem("token");
  if (!token) return;
  if (id.value === "") return;
  const status = document.getElementById("status");
  try {
    fetch(URL + `/${id.value}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authentication: `Bearer ${token}`,
      },
    });
    populateEditForm({
      id: "",
      brand: "",
      model: "",
      pricePrDay: "",
      bestDiscount: "",
    });
    status.innerText = "Successfully deleted car!";
  } catch (err) {
    status.innerText = err.message;
  }
};

export function initFindEditCar() {
  document.getElementById("btn-fetch-car").onclick = async () =>
    await fetchAndPopulateCar();
  document.getElementById("btn-submit-edited-car").onclick = async () =>
    await handleSubmitChange();
  document.getElementById("btn-delete-car").onclick = async () =>
    await handleDeleteCar();
}
