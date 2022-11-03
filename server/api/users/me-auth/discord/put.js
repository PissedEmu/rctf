import config from '../../../../config/server'
import { responses } from '../../../../responses'
import * as database from '../../../../database'
import * as auth from '../../../../auth'

export default {
  method: 'PUT',
  path: '/users/me/auth/discord',
  requireAuth: true,
  schema: {
    body: {
      type: 'object',
      properties: {
        discordToken: {
          type: 'string'
        }
      },
      required: ['discordToken']
    }
  },
  handler: async ({ req, user }) => {
    if (!config.discord) {
      return responses.badEndpoint
    }
    const discordData = await auth.token.getData(auth.token.tokenKinds.discordAuth, req.body.discordToken)
    if (discordData === null) {
      return responses.badDiscordToken
    }
    let result
    try {
      result = await database.users.updateUser({
        id: user.id,
        discordId: discordData.discordId
      })
    } catch (e) {
      if (e.constraint === 'users_discord_id_key') { // look into this
        return responses.badKnownDiscordId
      }
      throw e
    }
    if (result === undefined) {
      return responses.badUnknownUser
    }
    return responses.goodDiscordAuthSet
  }
}
