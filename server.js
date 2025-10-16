const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const ping = require("ping");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// 🔹 Servir les fichiers statiques
app.use("/assets", express.static(path.join(__dirname, "src/assets")));

// Charger les données JSON
const users = JSON.parse(fs.readFileSync("data.json"));

// 🔹 Fonction ping parallèle
async function pingHosts() {
    const results = await Promise.all(users.map(async (user) => {
        const hosts = await Promise.all(user.hosts.map(async (host) => {
            try {
                const res = await ping.promise.probe(host.ip, { timeout: 0.5 });
                return { name: host.name, ip: host.ip, alive: res.alive };
            } catch {
                return { name: host.name, ip: host.ip, alive: false };
            }
        }));
        return { name: user.name, hosts };
    }));
    return results;
}

// 🔹 Socket.IO : envoyer les données toutes les 5 secondes
io.on("connection", (socket) => {
    console.log("Client connecté");

    const interval = setInterval(async () => {
        const data = await pingHosts();
        socket.emit("update", data);
    }, 5000);

    socket.on("disconnect", () => {
        clearInterval(interval);
        console.log("Client déconnecté");
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/index.html"));
});

const playbookPath = "/playbooks/df_playbook.yaml";
const privateKeyPath = "/home/kali/.ssh/ansible_key";

app.get('/api/play', async (req, res) => {
  try {
    const { ip } = req.query;

    if (!ip) return res.status(400).json({ error: 'IP address is required to play a playbook.' });

    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    if (!ipRegex.test(ip)) return res.status(400).json({ error: 'Invalid IP address' });

    const cmd = `ANSIBLE_HOST_KEY_CHECKING=FALSE ansible-playbook ${playbookPath} -i ${ip}, --private-key=${privateKeyPath}`;

    exec(cmd, { maxBuffer: 1024 * 1024}, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing playbook: ${error.message}`);
        return res.status(500).json({ error: `Error when running playbook ${playbook}: ${error.message}` });
      }
      res.json({ stdout, stderr });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrer le serveur
server.listen(PORT, () => console.log(`🚀 Dashboard en ligne sur http://localhost:${PORT}`));
