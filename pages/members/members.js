import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
const URL = API_URL + "/members/admin";

const populateModal = (data) => {
  document.getElementById("username").innerText = data.username;
  document.getElementById("email").innerText = data.email;
  document.getElementById("firstName").innerText = data.firstName;
  document.getElementById("lastName").innerText = data.lastName;
  document.getElementById("street").innerText = data.street;
  document.getElementById("city").innerText = data.city;
  document.getElementById("zip").innerText = data.zip;
  document.getElementById("created").innerText = data.created;
  document.getElementById("edited").innerText = data.edited;
  document.getElementById("ranking").innerText = data.ranking;
};

const handleModal = async (e) => {
  const username = e.target.id;
  if (username === "") return;
  try {
    const data = await fetch(URL + `/${username}`).then(handleHttpErrors);
    populateModal(data);
  } catch (err) {
    const modal = document.getElementById("member-details-modal");
    bootstrap.Modal.getInstance(modal).hide();
    document.getElementById("error").innerText = err.message;
  }
};

export async function initMembers() {
  const roles = localStorage.getItem("roles");
  const token = localStorage.getItem("token");
  if (token === undefined || token === null) {
    document.getElementById("error").innerText = "You must be logged in!";
    return;
  }
  if (!roles.split(",").includes("ADMIN")) {
    document.getElementById("error").innerText =
      "You must be of role Admin to view the member list";
    return;
  }
  try {
    const data = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(handleHttpErrors);
    const tableRowsStr = data
      .map(
        (member) => `
            <tr>
                <td>${member.username}</td>
                <td>${member.email}</td>
                <td>${member.firstName} ${member.lastName}</td>
                <td>${member.ranking}</td>
                <td><button id="${member.username}" class="btn btn-sm btn-primary" data-bs-toggle='modal' data-bs-target='#member-details-modal'>Details</button></td>
            </tr>
        `
      )
      .join("\n");
    const sanitize = sanitizeStringWithTableRows(tableRowsStr);
    document.getElementById("tbl-body").innerHTML = sanitize;
    document
      .getElementById("tbl-body")
      .addEventListener("click", async (e) => handleModal(e));
  } catch (err) {
    console.log(err);
  }
}
