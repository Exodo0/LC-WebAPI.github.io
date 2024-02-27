let apiKeyInput, resultDiv;

document.addEventListener("DOMContentLoaded", () => {
  apiKeyInput = document.getElementById("apiKey");
  resultDiv = document.getElementById("result");
  discordWebhookInput = document.getElementById("discordWebhook");
});

function validateApiKey() {
  const apiKey = apiKeyInput;

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

// Send Webhook whit commandLogs
function validateDiscordWebhook() {
  const webhookUrl = discordWebhookInput.value;

  if (!webhookUrl) {
    resultDiv.innerText = "Please enter a Discord webhook URL.";
    return false;
  }

  // Puedes agregar más validaciones aquí según tus requisitos

  return true;
}

async function getCommandLogs() {
  if (!validateApiKey() || !validateDiscordWebhook()) return;

  try {
    // Obtener los commandLogs desde el API de LC
    const response = await axios.get(
      "https://api.policeroleplay.community/v1/server/commandlogs",
      {
        headers: {
          "server-key": apiKeyInput.value,
          "Content-Type": "application/json",
        },
      }
    );

    const commandLogs = response.data;

    if (commandLogs.length === 0) {
      resultDiv.innerText = "No command logs available.";
      return;
    }

    // Formatear los commandLogs
    const formattedLogs = formatCommandLogs(commandLogs);

    // Enviar a Discord via webhook
    await sendToDiscordWebhook(formattedLogs);

    resultDiv.innerText = "Command logs sent to Discord successfully.";
  } catch (error) {
    console.error("Error fetching command logs:", error);
    resultDiv.innerText = `Error fetching command logs: ${error.response.data.message}`;
  }
}

function formatCommandLogs(commandLogs) {
  // Puedes personalizar este formato según tus necesidades
  return commandLogs
    .map((log) => {
      return `Player: ${log.Player}, Timestamp: ${log.Timestamp}, Command: ${log.Command}`;
    })
    .join("\n");
}

async function sendToDiscordWebhook(formattedLogs) {
  const webhookUrl = discordWebhookInput.value;

  try {
    // Crear un embed con la información
    const embed = {
      title: "Command Logs",
      description: formattedLogs,
      color: 0x3498db, // Puedes personalizar el color
      timestamp: new Date(),
    };

    // Enviar a Discord con el embed
    await axios.post(webhookUrl, { embeds: [embed] });
  } catch (error) {
    console.error("Error sending to Discord webhook:", error);
    resultDiv.innerText = `Error sending to Discord webhook: ${error.message}`;
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
