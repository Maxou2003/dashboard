class Toastr{

    constructor(type,title, message, duration=3000){
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.title = title;
        this.initToastr();
    }

    showToast(){       
       
       let style = `display: flex; flex-direction:row; position: fixed; top: 20px; right: 20px; padding: 10px 20px; border-radius: 5px; ${this.backgroundColor} color: white; font-family: Arial, sans-serif; z-index: 1000;`;
        document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="toast" style="${style}">
                <i class="${this.icon}" style="margin-right: 12px; justify-self: center; display: flex; align-self: center; font-size: 20px;"></i>
                <div>
                    <strong style="display:block; margin-bottom:5px;">${this.title}</strong>
                    <span>${this.message}</span>
                </div>
            </div>
        `);

        setTimeout(() => {
            document.querySelector('.toast').remove();
        }, this.duration);
    }

    initToastr(){

        switch(this.type){
            case "success":
                this.icon = "fa-solid fa-circle-check";
                this.backgroundColor = "background-color: #4CAF50;";
                break;
            case "error":
                this.icon = "fa-solid fa-xmark";
                this.backgroundColor = "background-color: #F44336; ";
                break;
            case "info":
                this.icon = "fa-solid fa-circle-info";
                this.backgroundColor = "background-color: #2196F3; ";
                break;
            case "warning":
                this.icon = "fa-solid fa-triangle-exclamation";
                this.backgroundColor = "background-color: #FF9800; ";
                break;
            default:
                this.icon = "fa-solid fa-circle-info";
                this.backgroundColor = "background-color: #2196F3; ";
                break;
        }
    }

}

export default Toastr;