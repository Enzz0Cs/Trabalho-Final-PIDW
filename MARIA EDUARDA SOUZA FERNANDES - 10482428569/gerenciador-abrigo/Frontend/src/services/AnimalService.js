import axios from 'axios';
const API_URL = 'http://localhost:3000/api/animais';

class AnimalService {

    /**
     * @param {string} termo
     */
    listar(termo = '') {
        const url = termo ? `${API_URL}?termo=${termo}` : API_URL;
        return axios.get(url).then(response => response.data);
    }

    /**
     * @param {object} dados
     */
    salvar(dados) {
        if (dados.animal_id) {
            return axios.put(`${API_URL}/${dados.animal_id}`, dados);
        } else {
            const { animal_id, ...dadosLimpos } = dados;
            return axios.post(API_URL, dadosLimpos);
        }
    }
    
    /**
     * @param {number} id
     */
    buscarPorId(id) {
        return axios.get(`${API_URL}/${id}`).then(response => response.data);
    }

    /**
     * @param {number} id
     */
    excluir(id) {
        return axios.delete(`${API_URL}/${id}`).then(response => response.data);
    }
}

export default new AnimalService();