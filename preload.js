const {ipcRenderer} = require('electron')

window.addEventListener("DOMContentLoaded", () => {

    let positionX = 0;
    let positionY = 0;

    const boxJumper = document.querySelector('.js-box');
    
    ipcRenderer.on('btnClick', (event, data) => {
        if(data === 'btnLeft') {
            jumpLeft();
        } else {
            jumpRight();
        }
    });

    const jumpLeft = () => {
        positionY += 10;
        positionX -= 5;
    } 
    const jumpRight =() => {
        positionX += 5;
        positionY += 10;
    }

    const render = () => {
        if(positionY > 0) {
            positionY -= 2.81;
        }
        boxJumper.style.left = `${positionX}px`;
        boxJumper.style.bottom = `${positionY}px`;
        window.requestAnimationFrame(() => render())
    }
    render();
})

