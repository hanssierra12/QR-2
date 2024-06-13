function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let curso = document.getElementById('curso').value;
        let nombree = document.getElementById('nombree').value;
        let nombrep = document.getElementById('nombrep').value;
        let codigoe = document.getElementById('codigoe').value;
        let cursoc = document.getElementById('cursoc').value;
        let c1 = document.getElementById('c1').value;
        let c2 = document.getElementById('c2').value;
        let c3 = document.getElementById('c3').value;
        let pa = document.getElementById('pa').value;
        let c4 = document.getElementById('c4').value;
        let cc1 = document.getElementById('cc1').value;
        let cl = document.getElementById('cl').value;
        let cl2 = document.getElementById('cl2').value;
        let cc2 = document.getElementById('cc2').value;

        const validationResult = validateFields(curso, nombree, nombrep, cursoc, codigoe, pa, cc1, cl, cc2, cl2);
        if (validationResult.isValid) {
            generatePDF(curso, nombree, nombrep, cursoc, codigoe, c1, c2, c3, c4, cc1, cc2, cl, cl2, pa);
        } else {
            alert(`por favor llena los espacios correctamente:\n${validationResult.message}`);
        }
    });

});

function validateFields(curso, nombree, nombrep, cursoc, codigoe, pa, cc1, cl, cc2, cl2) {
    const isNumber = value => /^\d+(\.\d+)?$/.test(value);
    const isAlpha = value => /^[A-Za-z\s]+$/.test(value);
    let message = "";

    console.log("Validating fields...");
    console.log(`curso: ${curso}`);
    console.log(`nombree: ${nombree}`);
    console.log(`nombrep: ${nombrep}`);
    console.log(`cursoc: ${cursoc}`);
    console.log(`codigoe: ${codigoe}`);
    console.log(`pa: ${pa}`);
    console.log(`cc1: ${cc1}`);
    console.log(`cl: ${cl}`);
    console.log(`cc2: ${cc2}`);
    console.log(`cl2: ${cl2}`);

    if (!curso) message += "Curso is required.\n";
    if (!nombree) message += "Nombre Estudiante is required.\n";
    if (!nombrep) message += "Nombre Profesor is required.\n";
    if (!cursoc) message += "Curso Corregido is required.\n";
    if (!codigoe) message += "Codigo Estudiante is required.\n";
    if (!pa) message += "Periodo Academico is required.\n";
    if (!cc1) {
        message += "la calficación en letra es requerida.\n";
    } else if (!isNumber(cc1)) {
        message += "la calficación en numero es requerida\n";
    }
    if (cc2 && !isNumber(cc2)) {
        message += "la calificación 2 es un numero.\n";
    }
    if (!cl) {
        message += "la calficación en letra es requerida\n";
    } else if (!isAlpha(cl)) {
        message += "la calficación solo contiene espacios y letras.\n";
    }
    if (cl2 && !isAlpha(cl2)) {
        message += "CL2 must contain only letters and spaces.\n";
    }

    const isValid = message === "";
    console.log(`Validation result: ${isValid ? "algunos son validos" : "algunos son invalidos"}`);
    console.log(message);

    return { isValid, message };
}

async function generatePDF(curso, nombree, nombrep, cursoc, codigoe, c1, c2, c3, c4, cc1, cc2, cl, cl2, pa) {
    const image = await loadImage("REPORTE DE CORRECION DE CALIFICACION.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('p', 'pt', 'letter');

    pdf.addImage(image, 'PNG', 0, 0, 565, 792);
    pdf.addImage(signatureImage, 'PNG', 120, 320, 300, 60);

    pdf.setFontSize(12);

    pdf.setFontSize(10);
    pdf.text(nombree, 250, 105);
    pdf.text(codigoe, 250, 90);
    pdf.text(curso, 250, 75);
    pdf.text(nombrep, 250, 120);
    pdf.text(cursoc, 250, 135);
    pdf.text(pa, 250, 150);
    pdf.text(c1, 290, 165);
    pdf.text(c2, 355, 165);
    pdf.text(c3, 420, 165);
    pdf.text(c4, 498, 165);
    pdf.text(cc1, 100, 289);
    pdf.text(cc2, 100, 315);
    pdf.text(cl, 320, 289);
    pdf.text(cl2, 320, 315);

    pdf.setFillColor(0, 0, 0);

    pdf.save("Solicitud de retiro de curso.pdf");
}

