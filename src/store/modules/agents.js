import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const agents = {
  state: {
    physicalAgents: [],
    physicalAgentsPagination: {},
    legalAgents: [],
    legalAgentsPagination: {},
    searchQuery: ''
  },
  getters: {
    physicalAgents: state => state.physicalAgents,
    physicalAgentsPagination: state => state.physicalAgentsPagination,
    legalAgents: state => state.legalAgents,
    legalAgentsPagination: state => state.legalAgentsPagination,
    searchQuery: state => state.searchQuery
  },
  mutations: {
    SET_PHYSICAL_AGENTS: (state, physicalAgents) => {
        state.physicalAgents = physicalAgents
    },
    SET_PHYSICAL_AGENTS_PAGINATION: (state, physicalAgentsPagination) => {
        state.physicalAgentsPagination = physicalAgentsPagination
    },
    SET_LEGAL_AGENTS: (state, legalAgents) => {
        state.legalAgents = legalAgents
    },
    SET_LEGAL_AGENTS_PAGINATION: (state, legalAgentsPagination) => {
        state.legalAgentsPagination = legalAgentsPagination
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    createOrUpdatePhysicalAgent (_, payload) {
        const { id, ...others } = payload
        const req = {
            url: id ? `/physical-counter-agent/${id}` : '/physical-counter-agent',
            method: id ? 'put' : 'post'
        }
        return request({
                url: req.url,
                method: req.method,
                data: others,
                headers: headers
            })
            .then(res => {
                return res
            })
            .catch(err => {
                return err
            })
    },
    createOrUpdateLegalAgent (_, payload) {
        const { id, ...others } = payload
        const req = {
            url: id ? `/legal-counter-agent/${id}` : '/legal-counter-agent',
            method: id ? 'put' : 'post'
        }
        return request({
                url: req.url,
                method: req.method,
                data: others,
                headers: headers
            })
            .then(res => {
                return res
            })
            .catch(err => {
                return err
            })
    },
    getPhysicalAgents ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/physical-counter-agent',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_PHYSICAL_AGENTS_PAGINATION', pagination)
          commit('SET_PHYSICAL_AGENTS', result.agents)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getLegalAgents ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/legal-counter-agent',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_LEGAL_AGENTS_PAGINATION', pagination)
          commit('SET_LEGAL_AGENTS', result.agents)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default agents
