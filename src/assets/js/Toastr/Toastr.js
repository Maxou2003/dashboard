class Toastr{

    constructor(type, message,icon="fa-regular fa-circle-exclamation", duration=3000){
        this.icon = icon;
        this.message = message;
        this.type = type;
        this.duration = duration;
    }

    showToast(){
       let style = `display: block; position: fixed; top: 20px; right: 20px; padding: 10px 20px; border-radius: 5px; background-color: #fff; color: black; font-family: Arial, sans-serif; z-index: 1000;`;
       let iconStyle = this.getIconStyle();
        document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="toast" style="${style}">
                <i class="${this.icon}" style="${iconStyle}"></i><span>${this.message}</span>
            </div>
        `);

        setTimeout(() => {
            document.querySelector('.toast').remove();
        }, this.duration);
    }

    getIconStyle(){
        switch(this.type){
            case "success":
                return "color: #4CAF50; margin-right: 10px;";
            case "error":
                return "color: #F44336; margin-right: 10px;";
            case "info":
                return "color: #2196F3; margin-right: 10px;";
            case "warning":
                return "color: #FF9800; margin-right: 10px;";
            default:
                return "color: #2196F3; margin-right: 10px;";
        }
    }

}

export default Toastr;