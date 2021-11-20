'use strict'

const Ticket = use('App/Models/Ticket');

class TicketController {
    async index({auth, request, response}){
        try {
            const user = await auth.getUser()
            const tickets = await Ticket.query().where('user_id', '=', user._id).fetch()
            return response.send(tickets)
        } catch (error) {
            console.log(error)
            return response.status(400).send({message: 'Erro ao buscar ingressos'})
        }
    }

    async store({auth, request, response}){
        const { tournament_id } = request.all()
        try {

            const user = await auth.getUser()
            const ticket = new Ticket()

            ticket.tournament_id = tournament_id
            ticket.user_id = user._id

            await ticket.save()
            return response.send(ticket)
        } catch (error) {
            console.log(error)
            return response.status(400).send({message: 'Erro ao criar ingresso'})
        }
    }

    async destroy({params, response}){
        const id = params.id

        try {
            const ticket = await Ticket.find(id)

            if(!ticket){
                return response.status(404).send({message: 'Ingresso não encontrada'})
            }

            await ticket.delete()

            return response.send({message: `Ingresso id ${id} apagada com sucesso`})
        } catch (error) {
            console.log(error)
            return response.status(400).send({message: 'Erro ao apagar ingresso'})
        }

    }
}

module.exports = TicketController
