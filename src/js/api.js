import axios from 'axios';

// URL base dell'API Open Library
const URL_BASE_API = process.env.URL_BASE_API || 'https://openlibrary.org';

/**
 * Funzione per recuperare i libri per categoria.
 * Effettua una richiesta all'API di Open Library per ottenere i libri in base alla categoria
 * specificata e restituisce l'array di libri.
 * 
 * @param {string} categoria - La categoria dei libri da cercare (es. "science-fiction").
 * @returns {Array} Un array di libri recuperati dalla risposta dell'API.
 */
export const recuperaLibriPerCategoria = async (categoria) => {
    try {
        // Effettua una richiesta GET all'API per recuperare i libri per categoria
        const risposta = await axios.get(`${URL_BASE_API}/subjects/${categoria}.json`);
        
        // Restituisce l'array di libri dalla risposta dell'API
        return risposta.data.works;
    } catch (errore) {
        // Se si verifica un errore, logga l'errore e restituisce un array vuoto
        console.error('Errore durante il recupero dei libri:', errore);
        return [];
    }
};

/**
 * Funzione per recuperare la descrizione di un libro utilizzando la chiave del libro.
 * Se viene restituito un reindirizzamento, esegue una seconda richiesta con la nuova chiave.
 * 
 * @param {string} chiaveLibro - La chiave del libro da cercare (es. "/works/OL8193508W").
 * @returns {string} La descrizione del libro, se disponibile, o un messaggio di default.
 */
export const recuperaDescrizioneLibro = async (chiaveLibro) => {
    try {
        // Effettua la prima richiesta all'API con la chiave del libro fornita
        let risposta = await axios.get(`${URL_BASE_API}${chiaveLibro}.json`);
        
        // Se la risposta contiene un tipo di reindirizzamento, aggiorna la chiave
        // e rifà la richiesta con la nuova chiave
        if (risposta.data.type?.key === '/type/redirect') {
            // La nuova chiave del libro si trova nel campo "location"
            chiaveLibro = risposta.data.location;
            
            // Effettua una nuova richiesta con la chiave aggiornata
            risposta = await axios.get(`${URL_BASE_API}${chiaveLibro}.json`);
        }

        // Verifica se la descrizione è disponibile
        let descrizione = risposta.data.description;

        // Se la descrizione è un oggetto, estrai la proprietà "value"
        if (typeof descrizione === 'object' && descrizione?.value) {
            descrizione = descrizione.value;
        }

        // Se la descrizione non è disponibile, restituisci il messaggio di default
        return descrizione || 'Descrizione non disponibile';
    } catch (errore) {
        // In caso di errore durante il recupero della descrizione, logga l'errore e restituisci il messaggio di default
        console.error('Errore durante il recupero della descrizione:', errore);
        return 'Descrizione non disponibile';
    }
};