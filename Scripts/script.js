document.addEventListener("DOMContentLoaded", () => {
  apiKeyInput = document.getElementById("apiKey");
  resultDiv = document.getElementById("result");
  discordWebhookInput = document.getElementById("discordWebhook");

  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.removeItem("dark-mode");
  }
}

const BASE_URL = "https://api.policeroleplay.community/v1/server";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.removeItem("dark-mode");
  }
}

async function getServerInfo() {
  const apiKey = apiKeyInput.value;
  if (!apiKey) {
    resultDiv.textContent = "Please enter the API Key";
    return;
  }
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        "Server-Key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    const data = response.data;
    resultDiv.innerHTML = formatServerInfo(data);
  } catch (error) {
    resultDiv.textContent = "Error to fetch info from your server";
    console.error(error);
  }
}

async function getServerPlayers() {
  const apiKey = apiKeyInput.value;
  if (!apiKey) {
    resultDiv.textContent = "Please enter the API Key";
    return;
  }
  try {
    const response = await axios.get(`${BASE_URL}/players`, {
      headers: {
        "Server-Key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    const data = response.data;
    if (data.length === 0) {
      return (resultDiv.innerHTML = "No users online in your server");
    }
    resultDiv.innerHTML = formatServerPlayers(data);
  } catch (error) {
    resultDiv.textContent = "Error to fetch players from your server";
    console.error(error);
  }
}

async function submitServerCommand() {
  const apiKey = apiKeyInput.value;
  const serverCommand = document.getElementById("serverCommand").value;
  if (!apiKey || !serverCommand) {
    resultDiv.textContent = "Please enter the API key and server command.";
    return;
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/command`,
      { command: serverCommand },
      {
        headers: {
          "Server-Key": `${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    resultDiv.textContent = "Command submitted successfully";
  } catch (error) {
    resultDiv.textContent = "Error to submit command to your server";
    console.error(error);
  }
}

function formatServerInfo(data) {
  const formattedData = `
    <strong>Server Name:</strong> ${data.Name}<br>
    <strong>Owner:</strong> ${data.OwnerId}<br>
    <strong>Co-Owners:</strong> ${data.CoOwnerIds.join(", ")}<br>
    <strong>Current Players:</strong> ${data.CurrentPlayers}/${
    data.MaxPlayers
  }<br>
    <strong>Join Key:</strong> ${data.JoinKey}<br>
    <strong>Account Verification Requirement:</strong> ${
      data.AccVerifiedReq
    }<br>
    <strong>Team Balance:</strong> ${data.TeamBalance ? "Enabled" : "Disabled"}
  `;
  return formattedData;
}

function formatServerPlayers(data) {
  return data
    .map(
      (player) => `
    <strong>Player Name:</strong> ${player.Player}<br>
    <strong>Team:</strong> ${player.Team}<br>
    <strong>Permissions:</strong> ${player.Permission}<br>
    <strong>Callsign:</strong> ${player.Callsign || "None"}<br>
  `
    )
    .join("<br>");
}
