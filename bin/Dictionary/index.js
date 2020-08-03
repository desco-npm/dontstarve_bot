const objectMap = require('object.map')
const objectFilter = require('object-filter')

// Classe de dicionário
class Dictionary {
  constructor () {
    // Adiciona à globais
    global.Dictionary = this

    // As sessões do dicionário
    this.sessions = {}

    // Importa sessões
    require('./ptbr')
    // require('./en')
    // require('./de')
    // require('./fr')
    // require('./es')
    // require('./it')
    // require('./zhcn')
  }

  /**
   * @description Adiciona uma sessão do dicionário
   * @param {String} _lang O idioma
   * @param {Object} _session A sessão do dicionário
   */
  add (_lang, _session) {
    this.sessions[_lang] = _session
  }

  /**
   * @description Recupera uma mensagem
   * @param {String} _serverConfig Configurações do servidor
   * @param {String} _module O módulo
   * @param {String} _id O Id da mensagem
   * @param {Object} _params Os parâmetros da mensagem
   * @returns {String} A mensagem
   */
  getMessage (_serverConfig, _module, _id, _params = {}) {
    const message = this.sessions[_serverConfig.lang].texts[_module].messages[_id]

    return typeof message !== 'function' ? message : message(_params, _serverConfig)
  }

  /**
   * @description Recupera uma mensagem no idioma pedido
   * @param {String} _lang O idioma
   * @param {String} _module O módulo
   * @param {String} _id O Id da mensagem
   * @param {Object} _params Os parâmetros da mensagem
   * @param {Object} _config Configurações do servidor
   * @returns {String} A mensagem
   */
  getMessageInLang (_lang, _module, _id, _params = {}, _config = {}) {
    return this.getMessage({ lang: _lang, ..._config, }, _module, _id, _params)
  }

  /**
   * @description Recupera um resumo do ódulo
   * @param {String} _lang O idioma
   * @param {String} _module O módulo
   * @returns {String} O resumo
   */
  getResume (_lang, _module) {
    return this.sessions[_lang].texts[_module].resume
  }

  /**
   * @description Recupera nome real de um módulo
   * @param {String} _lang O idioma
   * @param {String} _module O módulo passado pelo usuário
   * @returns {String} O nome do módulo
   */
  getModuleName (_lang, _module) {
    let module

    objectMap(this.sessions[_lang].texts, (v, k) => {
      if (v.name === _module) {
        module = k
      }
    })

    return module
  }

  /**
   * @description Recupera nome de um módulo no idioma do servidor
   * @param {String} _lang O idioma
   * @param {String} _module O módulo desejado
   * @returns {String} O nome do módulo
   */
  getTranslateModule (_lang, _module) {
    return this.sessions[_lang].texts[_module].name
  }

  /**
   * @description Recupera nome de um método no idioma do servidor
   * @param {String} _lang O idioma
   * @param {String} _module O módulo desejado
   * @param {String} _method O método desejado
   * @returns {String} O nome traduzido
   */
  getTranslateMethod (_lang, _module, _method) {
    return this.sessions[_lang].texts[_module].methods[_method].name
  }

  /**
   * @description Recupera informações um módulo de acordo com o idioma do servidor
   * @param {String} _lang O idioma
   * @param {String} _module O módulo desejado
   * @returns {Object} O módulo
   */
  getModuleInfo (_lang, _module) {
    return this.sessions[_lang].texts[this.getModuleName(_lang, _module)]
  }

  /**
   * @description Recupera nome real de um método
   * @param {String} _lang O idioma
   * @param {String} _module O módulo do método
   * @param {String} _method O método passado pelo usuário
   * @returns {String} O nome do método
   */
  getMethodName (_lang, _module, _method) {
    if ([ 'main', 'invalidRedir', ].indexOf(_method) > -1) return _method

    const module = this.sessions[_lang].texts[_module] || {}
    let method

    objectMap(module.methods || {}, (methodData, methodName) => {
      if (_method !== methodData.name) return

      method = methodName
    })

    return method
  }

  /**
   * @description Recupera nome de um parâmetro de um método
   * @param {String} _lang O idioma
   * @param {String} _module O módulo do método
   * @param {String} _method O método passado pelo usuário
   * @param {String} _params O parâmetro
   * @returns {String} O parâmetro com nome real
   */
  getMethodParam (_lang, _module, _method, _param) {
    // Recebe parâmetros da sessão do dicionário
    const dictionaryParams = this.sessions[_lang].texts[_module].methods[_method].params

    let param

    // Compara parâmetro informado com os traduzidos do dicioário
    // Se forem iguais, retorna igual do dicionário
    objectMap(dictionaryParams, (translate, real) => {
      if (translate !== _param) return

      param = real
    })

    return param
  }

  /**
   * @description Recupera nome traduzido de um parâmetro de um método
   * @param {String} _lang O idioma
   * @param {String} _module O módulo do método
   * @param {String} _method O método desejado
   * @param {String} _params O parâmetro
   * @returns {String} O parâmetro com nome traduzido
   */
  getTranslateMethodParam (_lang, _module, _method, _param) {
    // Retorna
    return this.sessions[_lang].texts[_module].methods[_method].params[_param]
  }

  /**
   * @description Formata uma data para o inglês
   * @param {String} _lang O idioma
   * @param {String} _date A data em padrão do uduina
   * @returns {String} A no formato do idioma
   */
  dateToEn (_lang, _date) {
    // Formato da data no idioma
    const format = this.sessions[_lang].dateFormat

    // Separa a data pelo separador
    const translateDate = _date.split(format.sep)

    // Une no formato americano
    return [
      translateDate[format.year], translateDate[format.month], translateDate[format.day],
    ].join('-')
  }

  /**
   * @description Retorna todos os idiomas suportados
   * @returns {Object} Objeto contendo nome, sigla e bandeira
   */
  langs () {
    return objectMap(this.sessions, (lang, initials) => {
      lang.initials = initials

      return objectFilter(lang, (v, k) => {
        return k !== 'texts'
      })
    })
  }
}

module.exports = new Dictionary()