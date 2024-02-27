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
    const response = await fetch(
      "https://api.policeroleplay.community/v1/server",
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    resultDiv.innerHTML = formatServerInfo(data);
  } catch (error) {
    resultDiv.innerText = "Error fetching server info.";
  }
}

function formatServerInfo(data) {
  const formattedData = `
    <strong>Nombre del servidor:</strong> ${data.Name}<br>
    <strong>Dueño:</strong> ${data.OwnerId}<br>
    <strong>Co-Dueños:</strong> ${data.CoOwnerIds.join(", ")}<br>
    <strong>Jugadores actuales:</strong> ${data.CurrentPlayers}/${
    data.MaxPlayers
  }<br>
    <strong>Clave de acceso:</strong> ${data.JoinKey}<br>
    <strong>Requisito de verificación de cuenta:</strong> ${
      data.AccVerifiedReq
    }<br>
    <strong>Balance de equipos:</strong> ${
      data.TeamBalance ? "Habilitado" : "Deshabilitado"
    }
  `;

  return formattedData;
}

// Players info
async function getServerPlayers() {
  if (!validateApiKey()) return;

  try {
    const response = await fetch(
      "https://api.policeroleplay.community/v1/server/players",
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log(data);

    if (Array.isArray(data)) {
      resultDiv.innerHTML = formatServerPlayers(data);
    } else {
      resultDiv.innerText = `Error: ${data.message}`;
    }
  } catch (error) {
    resultDiv.innerText = "Error fetching server players.";
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
    const response = await fetch(
      "https://api.policeroleplay.community/v1/server/command",

      {
        method: "POST",
        body: JSON.stringify({
          command: command,
        }),
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    resultDiv.innerText = data.message;
  } catch (error) {
    resultDiv.innerText = "Error executing command.";
  }
}

//Dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".sidebar").classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  document.querySelectorAll(".result").forEach((result) => {
    result.classList.toggle("dark-mode");
  });
}
