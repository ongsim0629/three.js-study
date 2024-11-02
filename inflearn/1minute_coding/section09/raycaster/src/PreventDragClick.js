export class PreventDragClick {
    constructor(elem){
        this.mouseMoved;
        let clickStartX;
        let clickstartY;
        let clickstartTime;
    
        elem.addEventListener('mousedown', e => {
            clickStartX = e.clientX;
            clickstartY = e.clientY;
            clickstartTime = Date.now();
        });
        elem.addEventListener('mouseup', e => {
            const xGap = Math.abs(e.clientX - clickStartX);
            const yGap = Math.abs(e.clientY - clickstartY);
            const timeGap = Date.now() - clickstartTime;
    
            if (xGap > 5 || yGap > 5 || timeGap > 500){
                this.mouseMoved = true;
            }
            else{
                this.mouseMoved = false;
            }
        })
    }
}