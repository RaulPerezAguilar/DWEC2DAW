/*
 * TAREA 1 TEMA 4: Calculadora de Media, Rango y Moda.
 * Solo usa prompt() para la entrada y alert() para la salida.
 * Sin librería Math y sin variables globales (todo vive dentro de funciones).
 */

// --- MÓDULO DE VALIDACIÓN ---
/**
 * Comprueba que el texto sea un entero positivo o cero (solo dígitos).
 * Rechaza decimales ("3.5"), negativos ("-2") y mezclas ("12abc").
 * @param {string} texto Texto introducido por el usuario.
 * @returns {boolean} true si es válido.
 */
function esEnteroNoNegativo(texto) {
    return /^\d+$/.test(texto);
}

// --- MÓDULO DE ENTRADA DE DATOS ---
/**
 * Solicita al usuario valores enteros positivos (o cero), sin límite de cantidad.
 * @returns {number[]} Array con los valores introducidos.
 */
function solicitarValores() {
    const valores = [];

    alert(
        "🚀 Calculadora Estadística 📊\n\n" +
        "Introduce valores enteros positivos (o cero) uno por uno.\n" +
        "Pulsa 'Cancelar' o deja el campo vacío y pulsa 'Aceptar' para finalizar."
    );

    while (true) {
        const entrada = prompt(
            `Valor #${valores.length + 1} (Cancelar/Aceptar sin valor para finalizar):`
        );

        // Fin de la entrada: Cancelar (null) o cadena vacía
        if (entrada === null || entrada.trim() === '') {
            if (valores.length === 0) {
                alert('⚠️ Debes introducir al menos un valor para continuar.');
                continue;
            }
            break;
        }

        const texto = entrada.trim();
        if (esEnteroNoNegativo(texto)) {
            valores.push(parseInt(texto, 10));
        } else {
            alert(`⛔ Error: "${entrada}" no es un entero positivo (o cero) válido. Inténtalo de nuevo.`);
        }
    }

    return valores;
}

// --- MÓDULOS DE CÁLCULO ESTADÍSTICO ---

/**
 * Media (promedio) de un array de números.
 * @param {number[]} arr
 * @returns {number}
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
 * Rango: diferencia entre el valor máximo y el mínimo.
 * @param {number[]} arr
 * @returns {number}
 */
function calcularRango(arr) {
    if (arr.length === 0) return 0;

    let min = arr[0];
    let max = arr[0];

    for (const valor of arr) {
        if (valor < min) min = valor;
        if (valor > max) max = valor;
    }
    return max - min;
}

/**
 * Moda, con los casos especiales de la especificación.
 * @param {number[]} arr
 * @returns {string}
 */
function calcularModa(arr) {
    if (arr.length === 0) return 'No aplicable (serie vacía)';

    const frecuencias = {}; // { valor: frecuencia }
    let maxFrecuencia = 0;

    // 1. Contar frecuencias y localizar la máxima
    for (const valor of arr) {
        frecuencias[valor] = (frecuencias[valor] || 0) + 1;
        if (frecuencias[valor] > maxFrecuencia) {
            maxFrecuencia = frecuencias[valor];
        }
    }

    // Todos los valores son únicos
    if (maxFrecuencia <= 1) {
        return 'No tiene moda.';
    }

    // 2. Valores con la frecuencia máxima
    const candidatosModa = [];
    for (const valorStr in frecuencias) {
        if (frecuencias[valorStr] === maxFrecuencia) {
            candidatosModa.push(parseInt(valorStr, 10));
        }
    }

    // Caso 1: un único valor
    if (candidatosModa.length === 1) {
        return candidatosModa[0].toString();
    }

    // Caso 2: dos valores
    if (candidatosModa.length === 2) {
        candidatosModa.sort((a, b) => a - b);
        const [valor1, valor2] = candidatosModa;

        if (valor2 === valor1 + 1) {
            const modaCalculada = (valor1 + valor2) / 2;
            return `${valor1}, ${valor2} (adyacentes) -> Moda: ${modaCalculada.toFixed(1)}`;
        }
        return `${valor1}, ${valor2}`;
    }

    // Caso 3: más de dos valores (multimodal)
    return `Multimodal (más de 2 valores): ${candidatosModa.join(', ')}`;
}

// --- FUNCIÓN PRINCIPAL ---

/**
 * Orquesta la entrada, los cálculos y la presentación de resultados.
 */
function ejecutarAnalisisEstadistico() {
    const valores = solicitarValores();

    if (valores.length === 0) {
        alert('Programa finalizado sin datos para analizar.');
        return;
    }

    const media = calcularMedia(valores).toFixed(2);
    const rango = calcularRango(valores);
    const modaResultado = calcularModa(valores);

    const resultados = `
✅ Análisis Estadístico Finalizado ✅
-------------------------------------------
Serie de Valores (${valores.length} en total):
[${valores.join(', ')}]
-------------------------------------------
1. Media (Promedio):
👉 ${media}

2. Rango (Máx - Mín):
👉 ${rango}

3. Moda:
👉 ${modaResultado}
-------------------------------------------
`;

    alert(resultados);
}
