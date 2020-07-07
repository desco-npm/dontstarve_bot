// Classe padrão dos comandos
class DefaultCommand {
  constructor ({ methodsDictionary, } = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name

    // Dicionário de métodos
    this.methodsDictionary = methodsDictionary || {}
  }

  /**
    * @description Executa o comando
    * @param {String} _command Nome do método
    * @param {Array[String]} _args Array com todos os argumentos
    * @param {Object} _message Objeto da mensagem
    * @param {Object} _config Configurações do boot no servidor
    */
  exec (_method, _args, _message, _config) {
    // Traduz o nome do método de acordo com o idioma do boot
    const method = this.methodsDictionary[_config.lang][_method] || _method

    this[method](_args, _message, _config)
  }

  /**
    * @description Retorna o ID do autor da mensagem
    * @param {Object} Objeto da mensagem
    * @returns {String} O ID
    */
  authorId (_message) {
    return _message.author.id
  }

  /**
    * @description Retorna o ID do servidor
    * @param {Object} Objeto da mensagem
    * @returns {String} O ID
    */
  serverId (_message) {
    return _message.channel.guild.id
  }

  /**
    * @description Retorna o ID do dono do servidor
    * @param {Object} Objeto da mensagem
    * @returns {String} O ID
    */
  serverOwnerID (_message) {
    return _message.guild.ownerID
  }

  /**
    * @description Retorna se o autor da mensagem é dono do servidor
    * @param {Object} Objeto da mensagem
    * @returns {Boolean}} Se é dono
    */
  authorOwnerServerID (_message) {
    return this.authorId(_message) === this.serverOwnerID(_message)
  }
}

module.exports = DefaultCommand