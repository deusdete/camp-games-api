'use strict'

const Tournament = use('App/Models/Tournament')
const Helpers = use('Helpers')
const Drive = use('Drive')

const updadeFile = require('../../../Utils/UpdateFile')
class TournamentController {
  async index({ request, response }) {
    const { category_id } = request.get()
    try {
      let tournaments = null
      if (category_id) {
        tournaments = await Tournament.query()
          .where('category_id', '=', category_id)
          .fetch()
      } else {
        tournaments = await Tournament.all()
      }

      return response.send(tournaments)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao buscar torneiros' })
    }
  }

  async show({ params, request, response }) {
    const id = params.id
    try {
      const tournament = await Tournament.find(id)

      return response.send(tournament)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao buscar torneiros' })
    }
  }

  async store({ request, response }) {
    const {
      name,
      category_id,
      description,
      code_access,
      date_and_time,
      prize,
      registration_fee,
      team,
    } = request.all()
    const image = request.file('image')

    try {
      
      let imageInfo = {
        url: '',
        filePath: '',
      }
  

      if(image){
        imageInfo = await updadeFile({
          folder: 'tournaments',
          subFolder: null,
          file: image,
        })
      }

      const tournament = new Tournament()

      tournament.name = name
      tournament.category_id = category_id
      tournament.image_host = imageInfo.url
      tournament.image_name = imageInfo.filePath
      tournament.description = description
      tournament.date_and_time = date_and_time
      tournament.code_access = code_access
      tournament.prize = prize
      tournament.registration_fee = registration_fee
      tournament.team = team
      tournament.active = true

      await tournament.save()
      return response.send(tournament)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao criar categorias' })
    }
  }

  async destroy({ params, response }) {
    const id = params.id

    try {
      const tournament = await Tournament.find(id)

      if (!tournament) {
        return response.status(404).send({ message: 'Torneio não encontrado' })
      }

      await Drive.delete(tournament.image_name)

      await tournament.delete()

      return response.send({
        message: `Torneio id ${id} apagado com sucesso`,
      })
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao apagar torneio' })
    }
  }
}

module.exports = TournamentController
