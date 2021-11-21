'use strict'

const Category = use('App/Models/Category')
const Helpers = use('Helpers')
const Drive = use('Drive')

class CategoryController {
  async index({ request, response }) {
    try {
      const categories = await Category.all()
      return response.send(categories)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao buscar categorias' })
    }
  }

  async store({ request, response }) {
    const { name } = request.all()

    try {

      let url_image = ''
      let file_name = ''

      request.multipart.file('image', {}, async (file) => {
        file_name = `${new Date().getTime()}.${file.clientName}`
        url_image = await Drive.disk('s3').put(file_name, file.stream)
      })
    
      await request.multipart.process()

      const category = new Category()

      category.name = name
      category.image_host = url_image
      category.image_name = file_name

      await category.save()
      return response.send(category)
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao criar categorias' })
    }
  }

  async destroy({ params, response }) {
    const id = params.id

    try {
      const category = await Category.find(id)

      if (!category) {
        return response
          .status(404)
          .send({ message: 'Categoria não encontrada' })
      }

      await Drive.delete(`uploads/${category.image_name}`)

      await category.delete()

      return response.send({
        message: `Categoria id ${id} apagada com sucesso`,
      })
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao apagar categorias' })
    }
  }
}

module.exports = CategoryController
