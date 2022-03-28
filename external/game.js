// import ArcadePrototype from './lib.js'

window.addEventListener("DOMContentLoaded", () => {
    window.__arcadeFeu.registerKey('a', 'ArrowLeft');
    window.__arcadeFeu.registerKey('b', 'ArrowRight');

    window.__arcadeFeu.addEventListener("keydown", (e) => {
        if(e.machineKey === "a"){
            jumpLeft();
        }else {
            jumpRight();
        }
    })

    let positionX = 0;
    let positionY = 0;

    const boxJumper = document.querySelector('.js-box');

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