import { Fragment } from 'preact'
import withStyles from '../jss'
import { putDiscord, deleteDiscord } from '../../api/auth'
import { useCallback } from 'preact/hooks'
import { useToast } from '../toast'
import DiscordButton from '../discord-button'

const DiscordCard = withStyles({
  discordButton: {
    '& button': {
      borderColor: '#d9d9d9 !important'
    }
  }
}, ({ classes, discordId, onUpdate }) => {
  const { toast } = useToast()

  const handleDiscordDone = useCallback(async ({ discordToken, discordId }) => {
    const { kind, message } = await putDiscord({ discordToken })
    if (kind !== 'goodDiscordAuthSet') {
      toast({ body: message, type: 'error' })
      return
    }
    onUpdate({ discordId })
  }, [toast, onUpdate])

  const handleRemoveClick = useCallback(async () => {
    const { kind, message } = await deleteDiscord()
    if (kind !== 'goodDiscordRemoved') {
      toast({ body: message, type: 'error' })
      return
    }
    onUpdate({ discordId: null })
  }, [toast, onUpdate])

  return (
    <div class='card'>
      <div class='content'>
        <p>Discord Integration</p>
        {discordId === null ? (
          <Fragment>
            <p class='font-thin u-no-margin'>To login with Discord and get a badge on your profile, connect Discord to your account.</p>
            <div class='row u-center'>
              <DiscordButton class={classes.discordButton} onDiscordDone={handleDiscordDone} />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p class='font-thin u-no-margin'>Your account is already connected to Discord. You can disconnect Discord from your account.</p>
            <div class='row u-center'>
              <button class='btn-info u-center' onClick={handleRemoveClick}>Remove</button>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
})

export default DiscordCard
