import Toastr from '../Toastr/Toastr.js';

class PlaybookModal {
    constructor() {
        this.modal = document.getElementById("playbookModal");
        this.hostName = document.getElementById("hostName");
        this.hostIP = document.getElementById("hostIP");
        this.hostOS = document.getElementById("hostOS");
        this.hostStatus = document.getElementById("hostStatus");
        this.tableContainer = document.getElementById("table-container");
        this.playbookSelector = document.getElementById("playbookSelect");
        this.outputField = document.getElementById("playbookOutput");

        this.hostData = null;
        this.playbooks = null;

        this.init();
    }

    init() {
        this.addActionsListener();
    }

    // LISTNERS

    addActionsListener() {
        if (!this.tableContainer) {
            console.warn("Table container not found !");
            return;
        }

        this.tableContainer.addEventListener("click", async (e) => {
            if (e.target.classList.contains("actions")) {
                const ip = e.target.dataset.userIp;
                await this.openModal(ip);
            }
        });
    }

    addCloseModalListner(){
        document.addEventListener("click",(e)=>{
            if(e.target.id == "closeModalBtn" || e.target === this.modal || e.target.id == "cancelBtn"){
                this.closeModal();
            }
        })
    }

    addSendBtnListner(){
        let launchBtn = document.getElementById('launchBtn');
        launchBtn.addEventListener("click", ()=>{
            this.handleRunningPlaybook();
        });
    }

    // LOGIQUE MODAL
    async openModal(ip) {
        try {
            this.hostData = await this.getHostData(ip);
            this.playbooks = await this.getAvailablePlaybooks();
            if (this.hostData) {
                this.renderModal();
                this.modal.style.display = "flex";
                this.addSendBtnListner();
                this.addCloseModalListner();
            } else {
                alert("Aucune donnée trouvée pour cet hôte.");
            }
        } catch (err) {
            console.error("Erreur lors de l’ouverture de la modale :", err);
        }
    }


    closeModal() {
        this.modal.style.display = "none";

        this.hostName.innerText = "";
        this.hostIP.innerText = "";
        this.hostOS.innerText = "";
        this.hostStatus.innerText = "";
        this.outputField.innerText ="";
        this.playbookSelector.innerHTML = `<option value="">-- Choisir un playbook --</option>`;
    }


    renderModal() {
        const host = this.hostData[0]?.host || {}; 

        this.hostName.innerText = this.hostData[0]?.name || "Inconnu";
        this.hostIP.innerText = host.ip || "N/A";
        this.hostOS.innerText = host.name || "N/A";
        this.hostStatus.innerText = host.alive ? "En ligne" : "Hors ligne";
        this.hostStatus.className = host.alive ? "status-online" : "status-offline";
        
        if(this.playbooks && Array.isArray(this.playbooks)){
            this.playbooks.forEach(playbook => {
                let cmd = playbook.replace('_playbook.yaml','');
                let option = document.createElement("option");

                option.value = playbook;
                option.innerText = `Lancer la commande ${cmd}`;
                this.playbookSelector.appendChild(option);
            });
                    
        }
    }

    async handleRunningPlaybook(){
        let selectedOption = this.playbookSelector.value;
        const stdout = await this.runPlaybook(selectedOption);

        if(stdout){
            this.outputField.innerText = stdout;
        }
    }

    // COMMUNICATION AVEC LE SERVER
    async getHostData(ip) {
        ip = ip.replaceAll('.', '-');

        try {
            const response = await fetch(`http://localhost:3000/api/host?ip=${ip}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            console.log("Réponse JSON :", data);
            return data;
        } catch (error) {
            console.error("Erreur:", error);
            alert("Une erreur est survenue lors de la récupération des données de l’hôte.");
            return null;
        }
    }

    async getAvailablePlaybooks(){
        try {
            const response = await fetch(`http://localhost:3000/api/playbooks`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            console.log("Réponse JSON :", data);
            return data.stdout;
        } catch (error) {
            console.error("Erreur:", error);
            alert("Une erreur est survenue lors de la récupération des playbooks disponibles.");
            return null;
        }
    }

    async runPlaybook(playbook){
        try {
            const host = this.hostData[0]?.host || {}; 
            if( host == {} || !playbook || playbook =="") {
                let toastr = new Toastr("error","Données manquantes !","Veuillez sélectionner un playbook valide.");
                toastr.showToast();
                return null;
            }
            if(!host.alive){
                let toastr = new Toastr("error","Hôte indisponible !","L'hôte est hors ligne. Impossible de lancer un playbook.");
                toastr.showToast();
                return null;
            }

            let ip = host.ip.replaceAll('.','-');
            const response = await fetch(`http://localhost:3000/api/play?playbook=${playbook}&ip=${ip}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                let data = await response.json();
                return data.error;
            }

            const data = await response.json();
            let toastr = new Toastr("success","Playbook lancé !","Le playbook a été lancé avec succès.");
            toastr.showToast();
            return data.stdout;
        } catch (error) {
            console.error("Erreur:", error);
            alert("Une erreur est survenue lors de la récupération des playbooks disponibles.");
            return null;
        }
    }

}


document.addEventListener('DOMContentLoaded', () => {
    console.log("File loaded !");
    window.playbookModal = new PlaybookModal();
});
