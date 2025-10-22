class Toastr{

    constructor(type,title, message,icon="fa-regular fa-circle-exclamation", duration=3000){
        this.icon = icon;
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.title = title;
    }

    showToast(){       
       let backgroundColor = this.getBackgroundColor();
       let style = `display: flex; flex-direction:row; position: fixed; top: 20px; right: 20px; padding: 10px 20px; border-radius: 5px; ${backgroundColor} color: white; font-family: Arial, sans-serif; z-index: 1000;`;
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

    getBackgroundColor(){
        switch(this.type){
            case "success":
                return "background-color: #4CAF50;";
            case "error":
                return "background-color: #F44336; ";
            case "info":
                return "background-color: #2196F3; ";
            case "warning":
                return "background-color: #FF9800; ";
            default:
                return "background-color: #2196F3; ";
        }
    }

}

export default Toastr;