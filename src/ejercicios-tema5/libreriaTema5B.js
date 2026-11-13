/*
 * TAREA 1 TEMA 5 (Parte B): Control de Temperaturas.
 * Array tridimensional temperaturas[seccion][maquina][sensor].
 * Solo prompt() para la entrada y alert() para la salida.
 * Sin librería Math y sin variables ni constantes globales.
 */

// --- MÓDULO DE VALIDACIÓN ---
/**
 * Convierte el texto introducido en un número. Admite negativos y decimales
 * (con punto o con coma).
 * @param {string} texto
 * @returns {number} El número, o NaN si el texto no es válido.
 */
function convertirTemperatura(texto) {
    const limpio = texto.trim().replace(',', '.');
    if (/^-?\d+(\.\d+)?$/.test(limpio)) {
        return parseFloat(limpio);
    }
    return NaN;
}

// --- MÓDULO DE ENTRADA DE DATOS ---
/**
 * Pide una temperatura concreta repitiendo la pregunta hasta que sea válida.
 * @returns {number|null} La temperatura, o null si el usuario pulsa Cancelar.
 */
function pedirTemperatura(seccion, maquina, sensor) {
    while (true) {
        const entrada = prompt(
            `Sección ${seccion + 1} · Máquina ${maquina + 1} · Sensor ${sensor + 1}\n` +
            'Introduce la temperatura (°C):'
        );

        if (entrada === null) return null; // Cancelar

        const valor = convertirTemperatura(entrada);
        if (!isNaN(valor)) return valor;

        alert(`⛔ "${entrada}" no es una temperatura válida. Usa números (ej. 85 o 92.5).`);
    }
}

/**
 * Solicita todas las temperaturas y construye el array temperaturas[seccion][maquina][sensor].
 * @returns {number[][][]|null} El array 3D, o null si el usuario cancela.
 */
function introducirTemperaturas(numSecciones, numMaquinas, numSensores) {
    const temperaturas = [];

    for (let s = 0; s < numSecciones; s++) {
        temperaturas[s] = [];
        for (let m = 0; m < numMaquinas; m++) {
            temperaturas[s][m] = [];
            for (let x = 0; x < numSensores; x++) {
                const valor = pedirTemperatura(s, m, x);
                if (valor === null) return null;
                temperaturas[s][m][x] = valor;
            }
        }
    }
    return temperaturas;
}

// --- MÓDULOS DE CÁLCULO ---
/**
 * Media de un array de números.
 */
function calcularMedia(arr) {
    if (arr.length === 0) return 0;
    let suma = 0;
    for (const valor of arr) {
        suma += valor;
    }
    return suma / arr.length;
}

/**
 * Temperatura media de cada máquina (media de sus sensores).
 * @returns {number[][]} medias[seccion][maquina]
 */
function calcularMedias(temperaturas) {
    const medias = [];
    for (let s = 0; s < temperaturas.length; s++) {
        medias[s] = [];
        for (let m = 0; m < temperaturas[s].length; m++) {
            medias[s][m] = calcularMedia(temperaturas[s][m]);
        }
    }
    return medias;
}

/**
 * Temperatura máxima de cada sección, indicando máquina y sensor donde se dio.
 * @returns {{maxima:number, maquina:number, sensor:number}[]} Un elemento por sección.
 */
function maximoPorSeccion(temperaturas) {
    const maximos = [];
    for (let s = 0; s < temperaturas.length; s++) {
        let maxima = temperaturas[s][0][0];
        let maqMax = 0;
        let senMax = 0;
        for (let m = 0; m < temperaturas[s].length; m++) {
            for (let x = 0; x < temperaturas[s][m].length; x++) {
                if (temperaturas[s][m][x] > maxima) {
                    maxima = temperaturas[s][m][x];
                    maqMax = m;
                    senMax = x;
                }
            }
        }
        maximos[s] = { maxima: maxima, maquina: maqMax, sensor: senMax };
    }
    return maximos;
}

/**
 * Detecta los sensores que superan el límite y muestra una alerta por cada uno.
 * @returns {number} Número de sobrecalentamientos detectados.
 */
function detectarSobrecalentamientos(temperaturas, limite) {
    let total = 0;
    for (let s = 0; s < temperaturas.length; s++) {
        for (let m = 0; m < temperaturas[s].length; m++) {
            for (let x = 0; x < temperaturas[s][m].length; x++) {
                if (temperaturas[s][m][x] > limite) {
                    total++;
                    alert(
                        `🔥 ¡SOBRECALENTAMIENTO!\n` +
                        `Sección ${s + 1} · Máquina ${m + 1} · Sensor ${x + 1}\n` +
                        `Temperatura: ${temperaturas[s][m][x]} °C (límite: ${limite} °C)`
                    );
                }
            }
        }
    }
    return total;
}

// --- MÓDULOS DE SALIDA ---
function mostrarMedias(medias) {
    let texto = '📊 TEMPERATURA MEDIA POR MÁQUINA\n----------------------------------\n';
    for (let s = 0; s < medias.length; s++) {
        texto += `Sección ${s + 1}:\n`;
        for (let m = 0; m < medias[s].length; m++) {
            texto += `   Máquina ${m + 1}: ${medias[s][m].toFixed(2)} °C\n`;
        }
    }
    alert(texto);
}

function mostrarMaximos(maximos) {
    let texto = '🌡️ TEMPERATURA MÁXIMA POR SECCIÓN\n----------------------------------\n';
    for (let s = 0; s < maximos.length; s++) {
        texto += `Sección ${s + 1}: ${maximos[s].maxima} °C ` +
                 `(Máquina ${maximos[s].maquina + 1}, Sensor ${maximos[s].sensor + 1})\n`;
    }
    alert(texto);
}

// --- FUNCIÓN PRINCIPAL ---
function ejecutarControlTemperaturas() {
    // Configuración local a la función (no global)
    const numSecciones = 2;
    const numMaquinas = 3;
    const numSensores = 5;
    const limiteSobrecalentamiento = 100;

    alert(
        '🏭 Control de Temperaturas\n\n' +
        `Se pedirán ${numSecciones * numMaquinas * numSensores} valores ` +
        `(${numSecciones} secciones, ${numMaquinas} máquinas, ${numSensores} sensores).`
    );

    const temperaturas = introducirTemperaturas(numSecciones, numMaquinas, numSensores);
    if (temperaturas === null) {
        alert('Entrada cancelada. Programa finalizado.');
        return;
    }

    mostrarMedias(calcularMedias(temperaturas));
    mostrarMaximos(maximoPorSeccion(temperaturas));

    const total = detectarSobrecalentamientos(temperaturas, limiteSobrecalentamiento);
    if (total === 0) {
        alert(`✅ Ningún sensor supera los ${limiteSobrecalentamiento} °C.`);
    }
}
