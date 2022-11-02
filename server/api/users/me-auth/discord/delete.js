import config from '../../../../config/server'
import { responses } from '../../../../responses'
import * as database from '../../../../database'

export default {
  method: 'DELETE',
  path: '/users/me/auth/discord',
  requireAuth: true,
  handler: async ({ user }) => {
    if (!config.discord) {
      return responses.badEndpoint
    }
    let result
    try {
      result = await database.users.removeDiscordId({ id: user.id })
    } catch (e) {
      if (e.constraint === 'require_email_or_discord_id') { // look into this
        return responses.badZeroAuth
      }
      throw e
    }
    if (result === undefined) {
      return responses.badDsicordNoExists
    }
    return responses.goodDiscordRemoved
  }
}
