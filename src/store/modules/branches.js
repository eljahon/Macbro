import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const branches = {
    state: {
      branches: [],
      pagination: {},
      selectedBranch: {}
    },
    getters: {
      pagination_branches: state => state.pagination,
      branches: state => state.branches,
      selected_branch: state => state.selectedBranch
    },
    mutations: {
      GET_BRANCHES: (state, branches) => {
          state.branches = branches
      },
      GET_SELECTED_BRANCH: (state, selectedBranch) => {
        state.selectedBranch = selectedBranch
      },
      GET_BRANCHES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getBranches ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          request({
              url: '/branches',
              method: 'get',
              headers: headers,
              params: { page: page.current, limit: page.pageSize }
          })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_BRANCHES_PAGINATION', pagination)
          commit('GET_BRANCHES', result.branches)
          commit('GET_SELECTED_BRANCH', {})
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getSelectedBranch ({ commit }, id) {
        return new Promise((resolve, reject) => {
            request({
                url: '/branches/' + id,
                method: 'get'
            })
            .then(result => {
            commit('GET_SELECTED_BRANCH', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
        })
    }
  }
}
  export default branches
