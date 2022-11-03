import * as database from '../../database'
import * as auth from '../../auth'
import { responses } from '../../responses'

export default {
  method: 'POST',
  path: '/auth/login',
  requireAuth: false,
  schema: {
    body: {
      type: 'object',
      properties: {
        teamToken: {
          type: 'string'
        },
        ctftimeToken: {
          type: 'string'
        },
        discordToken: {
          type: 'string'
        }
      },
      oneOf: [{
        required: ['teamToken']
      }, {
        required: ['ctftimeToken']
      }, {
        required: ['discordToken']
      }]
    }
  },
  handler: async ({ req }) => {
    let user
    if (req.body.ctftimeToken !== undefined) {
      const ctftimeData = await auth.token.getData(auth.token.tokenKinds.ctftimeAuth, req.body.ctftimeToken)
      if (ctftimeData === null) {
        return responses.badCtftimeToken
      }
      user = await database.users.getUserByCtftimeId({ ctftimeId: ctftimeData.ctftimeId })
    } else if (req.body.discordToken !== undefined) {
      const discordData = await auth.token.getData(auth.token.tokenKinds.discordAuth, req.body.discordToken)
      if (discordData === null) {
        return responses.badDiscordToken
      }
      user = await database.users.getUserByDiscordId({ discordId: discordData.discordId })
    } else {
      const uuid = await auth.token.getData(auth.token.tokenKinds.team, req.body.teamToken)
      if (uuid === null) {
        return responses.badTokenVerification
      }
      user = await database.users.getUserById({ id: uuid })
    }
    if (user === undefined) {
      return responses.badUnknownUser
    }
    const authToken = await auth.token.getToken(auth.token.tokenKinds.auth, user.id)
    return [responses.goodLogin, {
      authToken
    }]
  }
}
