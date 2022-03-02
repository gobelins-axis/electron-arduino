const {ipcRenderer} = require('electron')

window.addEventListener("DOMContentLoaded", () => {


    const buttonRed = document.querySelector('.js-red');
    const buttonBlue = document.querySelector('.js-blue');

    buttonRed.addEventListener('click', () => {
        postColor('red');
    });

    buttonBlue.addEventListener('click', () => {
        postColor('blue');
    });

    const postColor = (color) => {
        ipcRenderer.sendSync('colorClick', color);
    }

})

