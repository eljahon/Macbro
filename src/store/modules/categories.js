import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}
const categories = {
    state: {
      categories: [],
      categoriesWithChildren: [],
      pagination: {},
      searchQuery: ''
    },
    getters: {
      paginationCategories: state => state.pagination,
      categories: state => state.categories,
      categoriesWithChildren: state => state.categoriesWithChildren,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_CATEGORIES: (state, categories) => {
          state.categories = categories
      },
      GET_CATEGORIES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      GET_CATEGORIES_WITH_CHILDREN: (state, categoriesWithChildren) => {
        state.categoriesWithChildren = categoriesWithChildren
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      getCategories ({ commit, state }, payload = { page: null, lang: 'ru', search: true }) {
        let { page } = payload
        // if search === false all categories will be requested
        const { lang, search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: `/category`,
            headers: headers,
            params: {
              lang: lang,
              page: page.current,
              limit: page.pageSize,
              search: search ? searchQuery : ''
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_CATEGORIES_PAGINATION', pagination)
          commit('GET_CATEGORIES', result.categories)
        //   if (result.categories) {
        //     const getCategoriesWithChildren = (allCategories = [], categories) => {
        //     for (let i = 0; i < categories.length; i++) {
        //       var newCategory = {}
        //       newCategory.id = categories[i].id
        //       newCategory.description = categories[i].description
        //       newCategory.image = categories[i].image
        //       newCategory.name = categories[i].name
        //       newCategory.parent_id = categories[i].parent_id
        //       newCategory.slug = categories[i].slug
        //       allCategories.push(newCategory)
        //       if (categories[i].child_categories !== null) {
        //         allCategories = getCategoriesWithChildren(allCategories, categories[i].child_categories)
        //       }
        //     }
        //     return allCategories
        //   }
        //   commit('GET_CATEGORIES_WITH_CHILDREN', getCategoriesWithChildren([], result.categories))
        // }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    }
  }
}
  export default categories
