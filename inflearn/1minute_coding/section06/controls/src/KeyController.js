export class KeyController {
    constructor() {
        // 생성자
        this.keys = [];

        window.addEventListener('keydown', e => {
            // 해당되는 키가 어떤 키가 눌렸는 지 알 수 있다.
            // w키가 눌렸다면 this.keys["KeyW"] = true;
            console.log(e.code + ' 누름');
            this.keys[e.code] = true;
        })

        // 키를 뗐을 때
        window.addEventListener('keyup', e => {
            console.log(e.code +' 뗌');
            delete this.keys[e.code];
        })
    }
}