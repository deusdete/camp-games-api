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

    try {
      const user = await auth.getUser()
     
      let url_image = ''
      let file_name = ''
      
      request.multipart.file('image', {}, async (file) => {
        file_name = `${new Date().getTime()}.${image.subtype}`
        url_image = await Drive.disk('s3').put(file_name, file.stream)
      })
    
      await request.multipart.process()

      const banner = new Banner()

      banner.name = name
      banner.image_host = url_image
      banner.image_name = file_name
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
