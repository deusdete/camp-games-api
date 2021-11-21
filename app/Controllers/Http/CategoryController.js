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
    const image = request.file('image')
    try {
      const fileName = `${new Date().getTime()}.${image.subtype}`
      await image.move(Helpers.tmpPath('uploads'), {
        name: fileName,
      })

      if (!image.moved()) {
        return image.error()
      }

      const category = new Category()

      const file_host = process.env.NODE_ENV === 'development'
        ? `http://localhost:3333/files/${fileName}`
        : `https://camp-games-api.herokuapp.com/files/${fileName}`

      category.name = name
      category.image_host = file_host
      category.image_name = fileName

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
