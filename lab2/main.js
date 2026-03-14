// fix this code please to work in js
// Self-executing function

import { drawChart } from "./chart.js";

drawChart("hello world")

function validateForms() {
    'use strict';
    var forms = document.getElementsByClassName('needs-validation');

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
};


function changeColor(button) {
    if (button.style.backgroundColor === 'green') {
        button.style.backgroundColor = 'blue';
    } else {
        button.style.backgroundColor = 'green';
    }
}

window.changeColor = changeColor;
window.validateForms = validateForms;

validateForms();