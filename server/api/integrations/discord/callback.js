import got from 'got'
import { responses } from '../../../responses'
import * as auth from '../../../auth'
import config from '../../../config/server'

const tokenEndpoint = 'https://discord.com/api/oauth2/token'
const userEndpoint = 'https://discord.com/api/oauth2/@me'

export default {
  method: 'POST',
  path: '/integrations/discord/callback',
  requireAuth: false,
  schema: {
    body: {
      type: 'object',
      properties: {
        discordCode:
          type: 'string'
        }
      },
      required: ['discordCode']
    }
  },
  handler: async ({ req }) => {
    if (!config.discord) {
      return responses.badEndpoint
    }
    let tokenBody
    try {
      ({ body: tokenBody } = await got({
        url: tokenEndpoint,
        method: 'POST',
        responseType: 'json',
        form: {
          client_id: config.discord.clientId,
          client_secret: config.discord.clientSecret,
          code: req.body.discordCode
        }
      }))
    } catch (e) {
      if (e instanceof got.HTTPError && e.response.statusCode === 401) {
        return responses.badDiscordCode
      }
      throw e
    }
    const { body: userBody } = await got({
      url: userEndpoint,
      responseType: 'json',
      headers: {
        authorization: `Bearer ${tokenBody.access_token}`
      }
    })
    if (userBody.user === undefined) {
      return responses.badDiscordCode
    }
    const token = await auth.token.getToken(auth.token.tokenKinds.discordAuth, {
      name: userBody.username,
      discordId: userBody.id
    })
    return [responses.goodDiscordToken, {
      discordToken: token,
      discordName: userBody.username,
      discordId: userBody.id
    }]
  }
}
