// Idiomas
const langs = require('../config').langs

// Mensagem embutida
const { MessageEmbed, } = require('discord.js')

// Classe padrão dos comandos
class DefaultCommand {
  constructor ({ methods, resume, } = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name.toLowerCase()

    // Se não passou métodos, adiciona padrão com todos os idiomas
    if (!methods) {
      methods = {}

      langs.map(i => methods[i] = {})
    }
  }

  /**
   * @description Método padrão
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    _message.reply(Dictionary.getMessage(_config.lang, 'general', 'COMMAND_METHOD_REQUIRED'))
  }

  /**
    * @description Executa o comando
    * @param {String} _command Nome do método
    * @param {Array[String]} _args Array com todos os argumentos
    * @param {Object} _message Objeto da mensagem
    * @param {Object} _config Configurações dobot no servidor
    */
  exec (_method, _args, _message, _config) {
    // Chama o método passando os parâmetros
    this[_method](_args, _message, _config)
  }

  /**
    * @description Retorna o ID do autor da mensagem
    * @param {Object} _message Objeto da mensagem
    * @returns {String} O ID
    */
  authorId (_message) {
    return _message.author.id
  }

  /**
    * @description Retorna o nome do autor da mensagem
    * @param {Object} _message Objeto da mensagem
    * @returns {String} O nick
    */
  authorUserName (_message) {
    return _message.author.username
  }

  /**
    * @description Retorna o ID do servidor
    * @param {Object} _message Objeto da mensagem
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
    * @param {Object} _message Objeto da mensagem
    * @returns {Boolean} Se é dono
    */
  authorOwnerServer (_message) {
    return this.authorId(_message) === this.serverOwnerID(_message)
  }

  /**
    * @description Retorna o avatar do autor da mensagem da mensagem
    * @param {Object} _message Objeto da mensagem
    * @returns {String} A imagem
    */
  authorAvatar (_message) {
    return _message.author.displayAvatarURL()
  }

  /**
    * @description Retorna se um dado método existe em um dado idioma
    * @param {String} _method Nome do método
    * @param {String} _lang Idioma
    * @returns {Boolean} Se existe
    */
  methodExists (_method, _lang) {
    return _method === 'main' || !!this.methods[_lang][_method]
  }

  /**
   * @description Retorna uma mensagem embutida
   * @param {Object} _embedData Dados da mensagem embtida
   * @param {Object} _message Objeto da mensagem
   * @returns {Object} A mensagem embutida
   */
  embedMessage (_embedData, _message) {
    const embed = new MessageEmbed()

    if (_embedData.title) {
      embed.setTitle(_embedData.title)
    }

    if (_embedData.description) {
      embed.setDescription(_embedData.description)
    }

    if (_embedData.thumbnail) {
      embed.setThumbnail(_embedData.thumbnail)
    }

    return embed
  }
}

module.exports = DefaultCommand