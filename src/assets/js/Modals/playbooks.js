document.addEventListener('DOMContentLoaded',()=>{
    console.log("File loaded !");
    addActionsListener();
});

function addActionsListener(){
    const tableContainer = document.getElementById("table-container")
    console.log("Table Container has been found !")
    tableContainer.addEventListener("click",(e)=>{
        console.log("Got a click !");
        if(e.target.classList.contains("actions")){
            console.log("Action btn clicked ! ");
            openModal(e.target.dataset.userIp); 
        }
    });
}

function openModal(ip)
{
    console.log("Modal opened");
    hostData = null;
    ip = ip.replaceAll('.','-');

    fetch(`http://localhost:3000/api/host?ip=${ip}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Réponse JSON :', data);
        hostData = data;
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue');
    });

    
}

function closeModal()
{

}