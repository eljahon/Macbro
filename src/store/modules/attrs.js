import request from '@/utils/request'
export default {
    state: {
        attrs: [],
        loading: false,
        pagination: {}
    },
    getters: {
        allAttrs: (state) => state.attrs,
        loadAttrs: (state) => state.loading,
        paginationAttrs: (state) => state.pagination
    },
    mutations: {
        GET_ALL_ATTRS (state, payload) {
            state.attrs = payload
        },
        ATTR_LOAD_LOADING (state, payload) {
            state.loading = payload
        },
        GET_ATTR_PAGINATION (state, payload) {
            state.pagination = payload
        }
    },
    actions: {
        getAllAttrs ({ commit }, payload = { page: null }) {
            let { page } = payload
            var search = payload.search ? payload.search : undefined
            if (!page) {
                page = { current: 1, pageSize: 10, total: null }
            }
            commit('ATTR_LOAD_LOADING', true)
            return new Promise((resolve, reject) => {
                request({
                    url: '/product-property',
                    method: 'GET',
                    params: {
                        page: page.current,
                        search: search
                    }
                }).then(res => {
                    const pagination = { ...page }
                    pagination.total = parseInt(res.count)
                    commit('GET_ATTR_PAGINATION', pagination)
                    commit('ATTR_LOAD_LOADING', false)
                    resolve(res)
                    console.log(res)
                    commit('GET_ALL_ATTRS', res.product_properties)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        createAttrs ({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request({
                    url: '/product-property',
                    method: 'POST',
                    data: payload
                }).then(res => {
                    resolve()
                    console.log(res)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        deleteAttrs ({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request({
                    url: `/product-property/${payload}`,
                    method: 'delete'
                }).then(res => {
                    resolve()
                    console.log(res)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        updateAttrs ({ commit }, payload) {
            return new Promise((resolve, reject) => {
                var updateData = {
                    active: payload.edit ? payload.files.active : payload.active,
                    description: payload.edit ? payload.files.description : payload.description,
                    name: payload.edit ? payload.files.name : payload.name,
                    options: payload.edit ? payload.files.options.map(e => {
                        return {
                            name: e.name,
                            value: e.value
                        }
                    }) : payload.options ? payload.options.map(e => {
                        return {
                            name: e.name,
                            value: e.value
                        }
                    }) : [],
                    order: payload.edit ? payload.files.order : payload.order,
                    type: payload.edit ? payload.files.type : payload.type
                }
                console.log(updateData)
                if (!payload.edit) updateData.active = !updateData.active
                request({
                    url: `/product-property/${payload.edit ? payload.files.id : payload.id}`,
                    method: 'PUT',
                    data: updateData
                }).then(res => {
                    resolve()
                    console.log(res)
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
    }
}
