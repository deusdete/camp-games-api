'use strict'

const Tournament = use('App/Models/Tournament')
const Helpers = use('Helpers')
const Drive = use('Drive')

class ToumamentController {
  async index({ request, response }) {
    const { category_id } = request.get()
    try {
      let tourmaments = null
      if (category_id) {
        tourmaments = await Tournament.query()
          .where('category_id', '=', category_id)
          .fetch()
      } else {
        tourmaments = await Tournament.all()
      }

      return response.send(tourmaments)
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
      const fileName = `${new Date().getTime()}.${image.subtype}`
      await image.move(Helpers.tmpPath('uploads'), {
        name: fileName,
      })

      if (!image.moved()) {
        return image.error()
      }

      const tourmament = new Tournament()

      const file_host = process.env.NODE_ENV === 'development'
        ? `http://localhost:3333/files/${fileName}`
        : `https://camp-games-api.herokuapp.com/files/${fileName}`

      tourmament.name = name
      tourmament.category_id = category_id
      tourmament.image_host = file_host
      tourmament.image_name = fileName
      tourmament.description = description
      tourmament.date_and_time = date_and_time
      tourmament.code_access = code_access
      tourmament.prize = prize
      tourmament.registration_fee = registration_fee
      tourmament.team = team
      tourmament.active = true

      await tourmament.save()
      return response.send(tourmament)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao criar categorias' })
    }
  }

  async destroy({ params, response }) {
    const id = params.id

    try {
      const tourmament = await Tournament.find(id)

      if (!tourmament) {
        return response.status(404).send({ message: 'Torneio não encontrado' })
      }

      await Drive.delete(`uploads/${tourmament.image_name}`)

      await tourmament.delete()

      return response.send({
        message: `Torneio id ${id} apagado com sucesso`,
      })
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao apagar torneio' })
    }
  }
}

module.exports = ToumamentController
