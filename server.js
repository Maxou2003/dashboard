const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = require('./app');
const HostsController = require("./src/Controllers/HostsController")

const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// 🔹 Servir les fichiers statiques
app.use("/assets", express.static(path.join(__dirname, "src/assets")));

io.on("connection", (socket) => {
   
    const interval = setInterval(async () => {
        const data = await HostsController.pingHosts();
        socket.emit("update", data);
    }, 5000);

    socket.on("disconnect", () => {
        clearInterval(interval);
    });
});


server.listen(PORT, () => console.log(`🚀 Dashboard en ligne sur http://localhost:${PORT}`));
