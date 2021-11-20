'use strict'

const User = use('App/Models/User');

class AuthController {
  async login({ auth, request, response }) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const {token} = await auth.attempt(email, password, true)
      return response.send({token})
      // return response.send({url: `http://localhost:3000/auth-sso?token=${token}`})
    } catch (error) {
      console.log('error', error)
      return response.status(404).send({ error: 'Usuário não encontrado' })
    }
  }

  async register({ auth, request, response }) {
    const { username, email, password } = request.all()

    try {
      const userEmailExist = await User.findBy('email', email)

      if(userEmailExist){
        return response.status(400).send({ message: 'Usuário já existe' })
      }

      const userNameExist = await User.findBy('username', username)

      if(userNameExist){
        return response.status(400).send({ message: 'Novo de usuário já existe' })
      }

      const user = new User()
      user.username = username
      user.email = email
      user.password = password

      await user.save()

      const token = await auth.generate(user, true)
      return response.send({token})
    } catch (error) {
      console.log('error', error)
      return response.status(400).send({ error })
    }

  }
}

module.exports = AuthController
