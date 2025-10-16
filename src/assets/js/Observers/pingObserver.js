const socket = io();
const loader = document.getElementById("loader");
const tableContainer = document.getElementById("table-container");

function renderTable(data) {
    let html = `
                <table>
                    <tr>
                        <th>Utilisateur</th>
                        <th>Nom de la machine</th>
                        <th>Adresse IP</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
            `;

    data.forEach(user => {
        user.hosts.forEach((host, idx) => {
            html += `
                        <tr>
                            <td>${idx === 0 ? user.name : ""}</td>
                            <td>${host.name}</td>
                            <td>${host.ip}</td>
                            <td>
                                <span class="status ${host.alive ? 'online' : 'offline'}">
                                    ${host.alive ? 'En ligne' : 'Hors ligne'}
                                </span>
                            </td>
                            <td class="actions" data-user-ip="${host.ip}">⋮</td>
                        </tr>
                    `;
        });
    });

    html += `</table>`;
    tableContainer.innerHTML = html;
}

socket.on("update", (data) => {
    loader.style.display = "none";
    tableContainer.style.display = "block";
    renderTable(data);
});