import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const reviews = {
    state: {
      reviews: [],
      reviewsPagination: {}
    },
    getters: {
      reviewsData: state => state.reviews,
      reviewsPagination: state => state.reviewsPagination
    },
    mutations: {
      GET_REVIEWS: (state, reviews) => {
          state.reviews = reviews
      },
      GET_REVIEWS_PAGINATION: (state, reviewsPagination) => {
          state.reviewsPagination = reviewsPagination
      }
    },
    actions: {
      getReviews ({ commit }, payload = { page: null, productSlug: '' }) {
        let { page } = payload
        const { productSlug } = payload
        console.log('productSlug', productSlug)
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
            console.log(page)
            request({
                url: `/feedback`,
                headers: headers,
                params: {
                    page: page.current,
                    product: productSlug
                }
            })
            .then(result => {
                const pagination = { ...page }
                pagination.total = parseInt(result.count)
                console.log(pagination)
                console.log('pagination')
                commit('GET_REVIEWS_PAGINATION', pagination)
                commit('GET_REVIEWS', result.feedbacks)
                resolve()
            })
            .catch(error => {
                reject(error)
            })
      })
    }
  }
}
  export default reviews
