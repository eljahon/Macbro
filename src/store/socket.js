const socket = {
    state: {
        isConnected: false,
        socketMessage: ''
    },
    getters: {
        isConnected: state => state.isConnected,
        socketMessage: state => state.socketMessage
    },
    mutations: {
      SET_CONNECTION: (state, query) => {
        state.isConnected = true
      },
      SET_MESSAGE: (state, query) => {
        state.socketMessage = query
      }
    },
    actions: {
        MakeConnection (commit, payload) {
            const conn = new WebSocket('ws://api.admin.macbro.uz/ws?id=9c7e5e8d-c959-47ee-abb3-4b2f286eb2cf')
            conn.onmessage = (evt) => {
                console.log('Soc message', evt)
                this.$notification.info({
                    message: this.$t('welcome'),
                    description: this.$t('greeting')
                })
                commit('SET_CONNECTION')
            }
            conn.onopen = (evt) => {
                console.log('Soc open', evt)
                this.$notification.info({
                    message: this.$t('welcome'),
                    description: this.$t('greeting')
                })
                commit('SET_MESSAGE')
            }
        }
    }
}

export default socket
