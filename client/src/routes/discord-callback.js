import { Component } from 'preact'

export default class DiscordCallback extends Component {
  componentDidMount () {
    window.opener.postMessage({
      kind: 'discordCallback',
      state: this.props.state,
      discordCode: this.props.code
    }, location.origin)
    window.close()
  }

  render () {
    return null
  }
}
