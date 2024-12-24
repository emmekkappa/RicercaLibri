// Importazione delle librerie e funzioni necessarie
import _ from 'lodash';
import { recuperaLibriPerCategoria, recuperaDescrizioneLibro } from './api';

// Selezione degli elementi del DOM per la ricerca e per la visualizzazione dei risultati
const categoriaInput = document.getElementById('categoria');
const bottoneCerca = document.getElementById('cerca');
const listaLibri = document.getElementById('lista-libri');

/**
 * Crea un singolo elemento di lista per ciascun libro.
 * @param {Object} libro - Un oggetto libro contenente titolo, autori e chiave.
 * @returns {HTMLElement} - L'elemento `li` con titolo, autore e spazio per la descrizione.
 */
const creaElementoLibro = (libro) => {
    // Creazione dell'elemento di lista per visualizzare il titolo e l'autore
    const elementoLista = document.createElement('li');
    elementoLista.classList.add('list-group-item');
    elementoLista.innerHTML = `<strong>${libro.title}</strong> di ${libro.authors.map((autore) => autore.name).join(', ')}`;

    // Crea un elemento per la descrizione del libro (inizialmente nascosto)
    const descrizioneElemento = document.createElement('p');
    descrizioneElemento.classList.add('descrizione-libro');
    descrizioneElemento.style.display = 'none'; // Nasconde la descrizione all'inizio
    elementoLista.appendChild(descrizioneElemento);

    // Aggiunge un evento di click all'elemento lista per mostrare/nascondere la descrizione
    elementoLista.addEventListener('click', async () => {
        if (descrizioneElemento.style.display === 'none') {
            // Se la descrizione non è visibile, effettua la chiamata API per ottenerla
            const descrizione = await recuperaDescrizioneLibro(libro.key);
            descrizioneElemento.textContent = descrizione;
            descrizioneElemento.style.display = 'block'; // Mostra la descrizione
        } else {
            // Nasconde la descrizione se è già visibile
            descrizioneElemento.style.display = 'none';
        }
    });

    return elementoLista; // Ritorna l'elemento lista creato
};

/**
 * Visualizza la lista dei libri ottenuti dalla ricerca.
 * @param {Array} libri - Array di oggetti libro recuperati dalla chiamata API.
 */
const visualizzaLibri = (libri) => {
    listaLibri.innerHTML = ''; // Svuota la lista corrente prima di aggiungere nuovi risultati
    libri.forEach(libro => listaLibri.appendChild(creaElementoLibro(libro))); // Aggiunge ogni libro alla lista
};

/**
 * Converte la categoria inserita dall'utente in un formato compatibile con l'API.
 * @param {string} categoria - Categoria inserita dall'utente.
 * @returns {string} - Categoria formattata per l'API (es. "science fiction" -> "science-fiction").
 */
const formattaCategoria = (categoria) => {
    // Rimuove spazi aggiuntivi, converte in minuscolo e sostituisce spazi interni con trattini
    return categoria.trim().toLowerCase().replace(/\s+/g, '-');
};

// Aggiunge un evento click al pulsante di ricerca
bottoneCerca.addEventListener('click', async () => {
    // Recupera e formatta il valore inserito dall'utente
    const categoriaInserita = categoriaInput.value;
    const categoriaFormattata = formattaCategoria(categoriaInserita);

    // Verifica che la categoria non sia vuota
    if (categoriaFormattata) {
        // Recupera i libri della categoria e li visualizza
        const libri = await recuperaLibriPerCategoria(categoriaFormattata);
        visualizzaLibri(libri);
    } else {
        // Mostra un avviso se il campo categoria è vuoto
        alert('Inserisci una categoria valida.');
    }
});