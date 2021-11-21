'use strict'

const Category = use('App/Models/Category')
const Helpers = use('Helpers')
const Drive = use('Drive')

const updadeFile = require('../../../Utils/UpdateFile')

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

      let imageInfo = {
        url: '',
        filePath: '',
      }
  

      if(image){
        imageInfo = await updadeFile({
          folder: 'categories',
          subFolder: null,
          file: image,
        })
      }
      

      const category = new Category()

      category.name = name
      category.image_host = imageInfo.url
      category.image_name = imageInfo.filePath

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
