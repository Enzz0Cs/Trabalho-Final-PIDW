import ApiService from './ApiService.js';
const ANIMAL_ENDPOINT = '/animais'; 

class AnimalService {

  /**
   * @param {string} termo
   * @returns {Promise<Array>}
   */
  static async listar(termo = '') {
    try {
      const endpoint = termo ? `${ANIMAL_ENDPOINT}?termo=${termo}` : ANIMAL_ENDPOINT;
      return await ApiService.get(endpoint);
    } catch (error) {
      throw new Error(`Falha ao listar animais: ${error.message}`);
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async buscarPorId(id) {
    try {
      return await ApiService.get(`${ANIMAL_ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Falha ao buscar animal ${id}: ${error.message}`);
    }
  }

  /**
   * @param {Object} dadosAnimal
   * @returns {Promise<Object>}
   */
  static async criar(dadosAnimal) {
    try {
      return await ApiService.post(ANIMAL_ENDPOINT, dadosAnimal);
    } catch (error) {
      throw new Error(`Falha ao criar cadastro de animal: ${error.message}`);
    }
  }

  /**
   * @param {number} id
   * @param {Object} dadosAnimal
   * @returns {Promise<Object>}
   */
  static async atualizar(id, dadosAnimal) {
    try {
      return await ApiService.put(`${ANIMAL_ENDPOINT}/${id}`, dadosAnimal);
    } catch (error) {
      throw new Error(`Falha ao atualizar animal ${id}: ${error.message}`);
    }
  }

  /**
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  static async excluir(id) {
    try {
      return await ApiService.delete(`${ANIMAL_ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Falha ao excluir animal ${id}: ${error.message}`);
    }
  }
}

export default AnimalService;