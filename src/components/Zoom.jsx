import React, { Component } from 'react'
import queryString from 'query-string'
import { ZoomMtg } from '@zoomus/websdk'
import { get } from '../utils/promise'
import '@zoomus/websdk/dist/css/bootstrap.css'
import '@zoomus/websdk/dist/css/react-select.css'
import './css/zoom.css'

export default class Zoom extends Component {
  constructor () {
    super()
    this.state = {
      meeting: {}
    }
  }

  componentDidMount () {
    const opcoes = queryString.parse(window.location.search)
    if (opcoes.meetingNumber && opcoes.userName && opcoes.userEmail) {
      const meeting = {
        meetingNumber: opcoes.meetingNumber,
        userName: opcoes.userName,
        userEmail: opcoes.userEmail,
        passWord: opcoes.passWord || ''
      }
      this.setState({ meeting }, () => { this.initialize() })
    }
  }

  join = () => {
    get(`/api/v1/autenticar/zoom/${this.state.meeting.meetingNumber}`).then(resposta => {
      if (!resposta || !resposta.success || !resposta.data) {
        throw new Error('Não foi possível conectar ao Zoom')
      }

      ZoomMtg.init({
        leaveUrl: window.location.href,
        isSupportChat: false,
        isSupportQA: false,
        showMeetingHeader: false,
        videoHeader: false,
        disableInvite: true,
        inviteUrlFormat: 'hide',
        error: erro => { erro && console.error(erro) },
        success: () => {
          ZoomMtg.join({
            ...this.state.meeting,
            ...resposta.data, // resposta.data = { apiKey: '...', signature: '...' }
            error: erro => { erro && console.error(erro) }
          })
        }
      })
    })
  }

  initialize = () => {
    if (!ZoomMtg.checkSystemRequirements()) throw new Error('O Zoom não é suportado neste navegador')

    ZoomMtg.setZoomJSLib('/zoom/lib', '/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareJssdk()
    this.join()
  }

  render () {
    return <div id='zmmtg-root' />
  }
}
