import { Component } from 'preact'
import Discord from '../icons/discord.svg'
import openPopup from '../util/discord'
import withStyles from '../components/jss'
import { discordCallback } from '../api/auth'
import { withToast } from '../components/toast'

export default withStyles({
  discordButton: {
    margin: 'auto',
    lineHeight: '0',
    padding: '10px',
    background: '#222',
    '&:hover': {
      background: '#222'
    },
    '& svg': {
      width: '150px'
    }
  }
}, withToast(class DiscordButton extends Component {
  componentDidMount () {
    window.addEventListener('message', this.handlePostMessage)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handlePostMessage)
  }

  oauthState = null

  handlePostMessage = async (evt) => {
    if (evt.origin !== location.origin) {
      return
    }
    if (evt.data.kind !== 'discordCallback') {
      return
    }
    if (this.oauthState === null || evt.data.state !== this.oauthState) {
      return
    }
    const { kind, message, data } = await discordCallback({
      discordCode: evt.data.discordCode
    })
    if (kind !== 'goodDiscordToken') {
      this.props.toast({
        body: message,
        type: 'error'
      })
      return
    }
    this.props.onDiscordDone(data)
  }

  handleClick = () => {
    this.oauthState = openPopup()
  }

  render ({ classes, ...props }) {
    return (
      <div {...props} >
        <button class={classes.discordButton} onClick={this.handleClick}>
          <Discord />
        </button>
      </div>
    )
  }
}))
