let apiKeyInput, resultDiv;

document.addEventListener("DOMContentLoaded", () => {
  apiKeyInput = document.getElementById("apiKey");
  resultDiv = document.getElementById("result");
});

function validateApiKey() {
  const apiKey = apiKeyInput.value;
  if (!apiKey) {
    resultDiv.innerText = "Please enter an API key.";
    return false;
  }
  return true;
}

// Server info

async function getServerInfo() {
  if (!validateApiKey()) return;

  try {
    const response = await axios.get(
      "https://api.policeroleplay.community/v1/server",
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    resultDiv.innerHTML = formatServerInfo(data);
  } catch (error) {
    console.error("Error fetching server info:", error);
    resultDiv.innerText = `Error fetching server info: ${error.response.data.message}`;
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

// Players info
async function getServerPlayers() {
  if (!validateApiKey()) return;

  try {
    const response = await axios.get(
      "https://api.policeroleplay.community/v1/server/players",
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    //En caso de recibir un array, sin usuarios conectados notificarlo

    if (data.length === 0) {
      resultDiv.innerText = "No players are currently connected to the server.";
      return;
    } else if (Array.isArray(data)) {
      resultDiv.innerHTML = formatServerPlayers(data);
    } else {
      resultDiv.innerText = `Error: ${data.message}`;
    }
  } catch (error) {
    console.error("Error fetching server players:", error);
    resultDiv.innerText = `Error fetching server players: ${error.response.data.message}`;
  }
}

function formatServerPlayers(data) {
  const listItems = data.map((player) => {
    return `<li><strong>${player.Player}</strong> - ${player.Permission}</li>`;
  });

  const formattedData = `<ul>${listItems.join("")}</ul>`;

  return formattedData;
}

// Execute command
async function submitServerCommand() {
  if (!validateApiKey()) return;

  const command = document.getElementById("serverCommand").value;
  if (!command) {
    resultDiv.innerText = "Please enter a command.";
    return;
  }

  try {
    const response = await axios.post(
      "https://api.policeroleplay.community/v1/server/command",
      { command },
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    resultDiv.innerText = data.message;
  } catch (error) {
    console.error("Error executing command:", error);
    resultDiv.innerText = `Error executing command: ${error.response.data.message}`;
  }
}

// Dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".sidebar").classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  document.querySelectorAll(".result").forEach((result) => {
    result.classList.toggle("dark-mode");
  });
}
