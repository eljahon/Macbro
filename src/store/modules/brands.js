import request from '@/utils/request'

const brands = {
    state: {
      brands: [],
      pagination: {},
      searchQuery: ''
    },
    getters: {
      paginationBrands: state => state.pagination,
      brands: state => state.brands,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_BRANDS: (state, brands) => {
          state.brands = brands
      },
      GET_BRANDS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getBrands ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all brands will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/brand',
            params: {
              page: page.current,
              limit: page.pageSize,
              search: search ? searchQuery : ''
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_BRANDS_PAGINATION', pagination)
          commit('GET_BRANDS', result.brands)
        //   if (result.categories) {
        //     const getBrandsWithChildren = (allcategories = [], categories) => {
        //     for (let i = 0; i < categories.length; i++) {
        //       var newCategory = {}
        //       newCategory.id = categories[i].id
        //       newCategory.description = categories[i].description
        //       newCategory.image = categories[i].image
        //       newCategory.name = categories[i].name
        //       newCategory.parent_id = categories[i].parent_id
        //       newCategory.slug = categories[i].slug
        //       allcategories.push(newCategory)
        //       if (categories[i].child_categories !== null) {
        //         allcategories = getBrandsWithChildren(allcategories, categories[i].child_categories)
        //       }
        //     }
        //     return allcategories
        //   }
        //   commit('GET_BRANDS_WITH_CHILDREN', getBrandsWithChildren([], result.categories))
        // }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default brands
