document.addEventListener('DOMContentLoaded',()=>{
    
});

function addActionsListener(){
    const tableContainer = document.getElementById("table-container")
    tableContainer.addEventListener("onclick",(e)=>{
        if(e.target.className.has("actions")){
            openModal(); // à completer
        }
    });
}