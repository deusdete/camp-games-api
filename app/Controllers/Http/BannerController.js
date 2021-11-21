'use strict'

const Banner = use('App/Models/Banner')
const Helpers = use('Helpers')
const Drive = use('Drive')

class BannerController {
  async index({ request, response }) {
    try {
      const banners = await Banner.all()
      return response.send(banners)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao buscar banner' })
    }
  }

  async store({ auth, request, response }) {
    const { name, tournament_id } = request.all()
    const image = request.file('image')
    try {
      const user = await auth.getUser()
      const fileName = `${new Date().getTime()}.${image.subtype}`
      await image.move(Helpers.tmpPath('uploads'), {
        name: fileName,
      })

      if (!image.moved()) {
        return image.error()
      }

      const banner = new Banner()

      const file_host = process.env.NODE_ENV === 'development'
        ? `http://localhost:3333/files/${fileName}`
        : `https://camp-games-api.herokuapp.com/files/${fileName}`

      banner.name = name
      banner.image_host = file_host
      banner.image_name = fileName
      banner.tournament_id = tournament_id
      banner.user_id = user._id

      await banner.save()
      return response.send(banner)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao criar banner' })
    }
  }

  async destroy({ params, response }) {
    const id = params.id

    try {
      const category = await Category.find(id)

      if (!category) {
        return response
          .status(404)
          .send({ message: 'Banner não encontrada' })
      }

      await Drive.delete(`uploads/${category.image_name}`)

      await category.delete()

      return response.send({
        message: `Banner id ${id} apagada com sucesso`,
      })
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao apagar banner' })
    }
  }
}

module.exports = BannerController
