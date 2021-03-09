// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
// import UserAccount from '@/views/account/UserAccount'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Analysis'),
        hideChildrenInMenu: true,
        meta: { title: 'dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] }
      },
      {
        path: '/orders',
        name: 'orders',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/orders/list',
        meta: { title: 'orders', keepAlive: true, icon: 'car', permission: ['orders'] },
        children: [
          {
            path: '/orders/list',
            name: 'OrdersList',
            component: () => import('@/views/orders/OrdersList'),
            meta: { title: 'orders', keepAlive: true, permission: ['orders'] }
          },
          {
            path: '/order/details/:id',
            name: 'OrderDetails',
            component: () => import('@/views/orders/OrderDetails'),
            meta: { title: 'order', keepAlive: true, permission: ['orders'] }
          },
          {
            path: '/order/edit/:id',
            name: 'OrderEdit',
            component: () => import('@/views/orders/OrderEdit'),
            meta: { title: 'order', keepAlive: true, permission: ['orders'] }
          }
        ]
      },
      {
        path: '/customers',
        name: 'customers',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/customers/list',
        meta: { title: 'customers', keepAlive: true, icon: 'team', permission: ['clients'] },
        children: [
          {
            path: '/customers/list',
            name: 'CustomersList',
            component: () => import('@/views/customers/CustomersList'),
            meta: { title: 'customers', keepAlive: true, permission: ['clients'] }
          },
          {
            path: '/customers/update/:id',
            name: 'CustomerEdit',
            component: () => import('@/views/customers/CustomerEdit'),
            meta: { title: 'customers', keepAlive: true, permission: ['clients'] }
          }
        ]
      },
      {
        path: '/city',
        name: 'city',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/city/list',
        meta: { title: 'cities', keepAlive: true, icon: 'environment', permission: ['city'] },
        children: [
          {
            path: '/city/list',
            name: 'citiesList',
            component: () => import('@/views/city/cityList'),
            meta: { title: 'cities', keepAlive: true, permission: ['city'] }
          },
          {
            path: '/city/create',
            name: 'citiesCreate',
            component: () => import('@/views/city/cityEdit'),
            meta: { title: 'cities', keepAlive: true, permission: ['city'] }
          },
          {
            path: '/city/update/:id',
            name: 'citiesEdit',
            component: () => import('@/views/city/cityEdit'),
            meta: { title: 'cities', keepAlive: true, permission: ['city'] }
          }
        ]
      },
      {
        path: '/company',
        name: 'company',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/company/list',
        meta: { title: 'companies', keepAlive: true, icon: 'bank', permission: ['company'] },
        children: [
          {
            path: '/company/list',
            name: 'companiesList',
            component: () => import('@/views/companies/CompaniesList'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/create',
            name: 'CompaniesCreate',
            component: () => import('@/views/companies/CompaniesEdit'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/update/:id',
            name: 'CompaniesEdit',
            component: () => import('@/views/companies/CompaniesEdit'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/:company_id/branches/list',
            name: 'branchesList',
            component: () => import('@/views/companies/branches/BranchesList'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/:company_id/branches/create',
            name: 'branchesCreate',
            component: () => import('@/views/companies/branches/BranchesEdit'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/:company_id/branches/update/:branch_id',
            name: 'BranchesEdit',
            component: () => import('@/views/companies/branches/BranchesEdit'),
            meta: { title: 'companies', keepAlive: true, permission: ['company'] }
          }
        ]
      },
      {
        path: '/catalog',
        redirect: '/catalog/categories',
        component: RouteView,
        meta: { title: 'catalog', icon: 'form', permission: ['catalog'] },
        children: [
          {
            path: '/catalog/categories',
            hideChildrenInMenu: true,
            name: 'CategoriesList',
            component: RouteView,
            redirect: '/catalog/categories/list',
            meta: { title: 'categories', keepAlive: true, permission: ['categories'] },
            children: [
              {
                path: '/catalog/categories/list',
                name: 'CategoriesListMain',
                props: true,
                component: () => import('@/views/categories/CategoriesList'),
                meta: { title: 'categories', keepAlive: true, permission: ['categories'] }
              },
              {
                path: '/catalog/categories/create',
                name: 'CategoriesCreate',
                props: true,
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['categories'] }
              },
              {
                path: '/catalog/categories/update/:id',
                name: 'CatagoriesUpdate',
                props: true,
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['categories'] }
              }
            ]
          },
          {
            path: '/catalog/attribute',
            hideChildrenInMenu: true,
            name: 'ProductAttributes',
            component: RouteView,
            redirect: '/catalog/attribute/list',
            meta: { title: 'attribute', keepAlive: true, permission: ['catalog'] },
            children: [
              {
                path: '/catalog/attribute/list',
                name: 'AttributeList',
                props: true,
                component: () => import('@/views/attributes/AttributesList'),
                meta: { title: 'attribute', keepAlive: true, permission: ['catalog'] }
              },
              {
                path: '/catalog/attribute/create',
                name: 'AttributeCreate',
                props: true,
                component: () => import('@/views/attributes/AttributesCreate'),
                meta: { title: 'attribute', keepAlive: true, permission: ['catalog'] }
              },
              {
                path: '/catalog/attribute/update/:id',
                name: 'AttributeEdit',
                props: true,
                component: () => import('@/views/attributes/AttributesCreate'),
                meta: { title: 'attribute', keepAlive: true, permission: ['catalog'] }
              }
            ]
          },
          {
            path: '/catalog/brands',
            hideChildrenInMenu: true,
            name: 'BrandsList',
            component: RouteView,
            redirect: '/catalog/brands/list',
            meta: { title: 'brands', keepAlive: true, permission: ['brands'] },
            children: [
              {
                path: '/catalog/brands/list',
                name: 'BrandsListMain',
                props: true,
                component: () => import('@/views/brands/BrandsList'),
                meta: { title: 'brands', keepAlive: true, permission: ['brands'] }
              },
              {
                path: '/catalog/brands/create',
                name: 'BrandsCreate',
                props: true,
                component: () => import('@/views/brands/BrandsCreate'),
                meta: { title: 'brands', keepAlive: true, permission: ['brands'] }
              },
              {
                path: '/catalog/brands/update/:id',
                name: 'BrandsUpdate',
                props: true,
                component: () => import('@/views/brands/BrandsCreate'),
                meta: { title: 'brands', keepAlive: true, permission: ['brands'] }
              }
            ]
          },
          {
            path: '/catalog/products',
            hideChildrenInMenu: true,
            name: 'Product',
            component: RouteView,
            redirect: '/catalog/products/list',
            meta: { title: 'products', keepAlive: true, permission: ['products'] },
            children: [
              {
                path: '/catalog/products/list',
                name: 'ProductsList',
                component: () => import('@/views/products/ProductsList'),
                meta: { title: 'products', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/products/create',
                name: 'ProductsCreate',
                component: () => import('@/views/products/ProductsCreate'),
                meta: { title: 'products', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/products/update/:id',
                name: 'ProductsUpdate',
                component: () => import('@/views/products/ProductsCreate'),
                meta: { title: 'products', keepAlive: true, permission: ['products'] }
              }
            ]
          },
          {
            path: '/catalog/product-variants',
            hideChildrenInMenu: true,
            name: 'ProductVariant',
            component: RouteView,
            redirect: '/catalog/product-variants/list',
            meta: { title: 'product_variants', keepAlive: true, permission: ['products'] },
            children: [
              {
                path: '/catalog/product-variants/list',
                name: 'ProductVariantsList',
                component: () => import('@/views/product-variants/ProductVariantsList'),
                meta: { title: 'product_variants', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/product-variants/create',
                name: 'ProductVariantsCreate',
                component: () => import('@/views/product-variants/ProductVariantsCreate'),
                meta: { title: 'product_variants', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/product-variants/update/:id',
                name: 'ProductVariantsUpdate',
                component: () => import('@/views/product-variants/ProductVariantsCreate'),
                meta: { title: 'product_variants', keepAlive: true, permission: ['products'] }
              }
            ]
          },
          {
            path: '/catalog/featured-products',
            name: 'Featured Products',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/catalog/featured-products/list',
            meta: { title: 'featured-products', keepAlive: true, permission: ['products'] },
            children: [
              {
                path: '/catalog/featured-products/list',
                name: 'FeaturedProducts',
                component: () => import('@/views/featured/FeaturedProductsList'),
                meta: { title: 'featured-products', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/featured-products/create',
                name: 'FeaturedProducts',
                component: () => import('@/views/featured/FeaturedProductsCreate'),
                meta: { title: 'featured-products', keepAlive: true, permission: ['products'] }
              },
              {
                path: '/catalog/featured-products/update/:id',
                name: 'FeaturedProducts',
                component: () => import('@/views/featured/FeaturedProductsCreate'),
                meta: { title: 'featured-products', keepAlive: true, permission: ['products'] }
              }
            ]
          }
        ]
      },
      {
        path: '/shops',
        hideChildrenInMenu: true,
        name: 'Shops',
        component: RouteView,
        redirect: '/shops/list',
        meta: { title: 'shops', keepAlive: true, icon: 'shop', permission: ['shops'] },
        children: [
          {
            path: '/shops/list',
            name: 'ShopsList',
            component: () => import('@/views/shops/ShopsList'),
            meta: { title: 'shops', keepAlive: true, permission: ['shops'] }
          },
          {
            path: '/shops/create',
            name: 'ShopsCreate',
            component: () => import('@/views/shops/ShopsCreate'),
            meta: { title: 'shops', keepAlive: true, permission: ['shops'] }
          },
          {
            path: '/shops/update/:id',
            name: 'ShopsUpdate',
            component: () => import('@/views/shops/ShopsCreate'),
            meta: { title: 'shops', keepAlive: true, permission: ['shops'] }
          }
        ]
      },
      {
        path: '/promos',
        name: 'promos',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/promos/list',
        meta: { title: 'promos', keepAlive: true, icon: 'dollar', permission: ['promos'] },
        children: [
          {
            path: '/promos/list',
            name: 'PromosList',
            component: () => import('@/views/promos/PromosList'),
            meta: { title: 'promos', keepAlive: true, permission: ['promos'] }
          },
          {
            path: '/promos/create',
            name: 'PromosCreate',
            component: () => import('@/views/promos/PromosCreate'),
            meta: { title: 'promos', keepAlive: true, permission: ['promos'] }
          },
          {
            path: '/promos/update/:id',
            name: 'PromosUpdate',
            component: () => import('@/views/promos/PromosCreate'),
            meta: { title: 'promos', keepAlive: true, permission: ['promos'] }
          }
        ]
      },
      {
        path: '/news',
        name: 'news',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/news/list',
        meta: { title: 'news', keepAlive: true, icon: 'read', permission: ['news'] },
        children: [
          {
            path: '/news/list',
            name: 'NewsList',
            component: () => import('@/views/news/NewsList'),
            meta: { title: 'news', keepAlive: true, permission: ['news'] }
          },
          {
            path: '/news/create',
            name: 'NewsCreate',
            component: () => import('@/views/news/NewsCreate'),
            meta: { title: 'news', keepAlive: true, permission: ['news'] }
          },
          {
            path: '/news/update/:id',
            name: 'NewsUpdate',
            component: () => import('@/views/news/NewsCreate'),
            meta: { title: 'news', keepAlive: true, permission: ['news'] }
          }
        ]
      },
      {
        path: '/agents',
        name: 'agents',
        component: RouteView,
        redirect: '/agents/physical',
        meta: { title: 'counterAgents', keepAlive: true, icon: 'contacts', permission: ['agents'] },
        children: [
          {
            path: '/agents/physical',
            name: 'agentsPhysical',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/agents/physical/list',
            meta: { title: 'physicalAgents', keepAlive: true, permission: ['agents'] },
            children: [
              {
                path: '/agents/physical/list',
                name: 'physicalAgentList',
                component: () => import('@/views/agents/physical/physicalAgentList'),
                meta: { title: 'physicalAgents', keepAlive: true, permission: ['agents'] }
              },
              {
                path: '/agents/physical/create',
                name: 'physicalAgentCreate',
                component: () => import('@/views/agents/physical/physicalAgentEdit'),
                meta: { title: 'physicalAgents', keepAlive: true, permission: ['agents'] }
              },
              {
                path: '/agents/physical/update/:id',
                name: 'physicalAgentUpdate',
                component: () => import('@/views/agents/physical/physicalAgentEdit'),
                meta: { title: 'physicalAgents', keepAlive: true, permission: ['agents'] }
              }
            ]
          },
          {
            path: '/agents/legal',
            name: 'agentsLegal',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/agents/legal/list',
            meta: { title: 'legalAgents', keepAlive: true, permission: ['agents'] },
            children: [
              {
                path: '/agents/legal/list',
                name: 'agentsLegalList',
                component: () => import('@/views/agents/legal/legalAgentList'),
                meta: { title: 'legalAgents', keepAlive: true, permission: ['agents'] }
              },
              {
                path: '/agents/legal/create',
                name: 'agentsLegalCreate',
                component: () => import('@/views/agents/legal/legalAgentEdit'),
                meta: { title: 'legalAgents', keepAlive: true, permission: ['agents'] }
              },
              {
                path: '/agents/legal/update/:id',
                name: 'agentsLegalUpdate',
                component: () => import('@/views/agents/legal/legalAgentEdit'),
                meta: { title: 'legalAgents', keepAlive: true, permission: ['agents'] }
              }
            ]
          }
        ]
      },
      {
        path: '/banner',
        name: 'banner',
        component: RouteView,
        redirect: '/banner',
        meta: { title: 'banners', keepAlive: true, icon: 'picture', permission: ['banners'] },
        children: [
          {
            path: '/banners',
            name: 'banners',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/banners/list',
            meta: { title: 'banners', keepAlive: true, permission: ['banners'] },
            children: [
              {
                path: '/banners/list',
                name: 'BannersList',
                component: () => import('@/views/banners/BannersList'),
                meta: { title: 'banners', keepAlive: true, permission: ['banners'] }
              },
              {
                path: '/banners/create',
                name: 'BannersCreate',
                component: () => import('@/views/banners/BannersCreate'),
                meta: { title: 'banners', keepAlive: true, permission: ['banners'] }
              },
              {
                path: '/banners/update/:id',
                name: 'BannersUpdate',
                component: () => import('@/views/banners/BannersCreate'),
                meta: { title: 'banners', keepAlive: true, permission: ['banners'] }
              }
            ]
          },
          {
            path: '/banner-positions',
            name: 'banner-positions',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/banner-positions/list',
            meta: { title: 'bannerPositions', keepAlive: true, permission: ['banners'] },
            children: [
              {
                path: '/banner-positions/list',
                name: 'BannerPositionsList',
                component: () => import('@/views/banner-positions/BannerPositionsList'),
                meta: { title: 'banner-positions', keepAlive: true, permission: ['banners'] }
              },
              {
                path: '/banner-positions/create',
                name: 'BannerPositionsCreate',
                component: () => import('@/views/banner-positions/BannerPositionsCreate'),
                meta: { title: 'banner-positions', keepAlive: true, permission: ['banners'] }
              },
              {
                path: '/banner-positions/update/:id',
                name: 'BannerPositionsUpdate',
                component: () => import('@/views/banner-positions/BannerPositionsCreate'),
                meta: { title: 'banner-positions', keepAlive: true, permission: ['banners'] }
              }
            ]
          }
        ]
      },
      {
        path: '/adminstrator',
        name: 'adminstrator',
        component: RouteView,
        redirect: '/adminstrator',
        meta: { title: 'adminstrators', keepAlive: true, icon: 'user-add', permission: ['admins'] },
        children: [
          {
            path: '/admins',
            name: 'admins',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/admins/list',
            meta: { title: 'admins', keepAlive: true, permission: ['admins'] },
            children: [
              {
                path: '/admins/list',
                name: 'AdminsList',
                component: () => import('@/views/admins/AdminsList'),
                meta: { title: 'admins', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/admins/create',
                name: 'AdminsCreate',
                component: () => import('@/views/admins/AdminsCreate'),
                meta: { title: 'admins', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/admins/update/:id',
                name: 'AdminsUpdate',
                component: () => import('@/views/admins/AdminsCreate'),
                meta: { title: 'admins', keepAlive: true, permission: ['admins'] }
              }
            ]
          },
          {
            path: '/permissions',
            name: 'permissions',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/permissions/list',
            meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] },
            children: [
              {
                path: '/permissions/list',
                name: 'PermissionsList',
                component: () => import('@/views/permissions/PermissionsList'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              },
              {
                path: '/permissions/create',
                name: 'PermissionsCreate',
                component: () => import('@/views/permissions/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              },
              {
                path: '/permissions/update/:id',
                name: 'PermissionsUpdate',
                component: () => import('@/views/permissions/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              }
            ]
          },
          {
            path: '/staff',
            name: 'staff',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/staff/list',
            meta: { title: 'staff', keepAlive: true, permission: ['admins'] },
            children: [
              {
                path: '/staff/list',
                name: 'staffList',
                component: () => import('@/views/staff/staffList'),
                meta: { title: 'staff', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/staff/create',
                name: 'staffCreate',
                component: () => import('@/views/staff/staffEdit'),
                meta: { title: 'staff', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/staff/update/:id',
                name: 'staffUpdate',
                component: () => import('@/views/staff/staffEdit'),
                meta: { title: 'staff', keepAlive: true, permission: ['admins'] }
              }
            ]
          },
          {
            path: '/roles',
            name: 'roles',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/roles/list',
            meta: { title: 'roles', keepAlive: true, permission: ['admins'] },
            children: [
              {
                path: '/roles/list',
                name: 'rolesList',
                component: () => import('@/views/roles/roleList'),
                meta: { title: 'roles', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/roles/create',
                name: 'rolesCreate',
                component: () => import('@/views/roles/roleEdit'),
                meta: { title: 'roles', keepAlive: true, permission: ['admins'] }
              },
              {
                path: '/roles/update/:id',
                name: 'rolesUpdate',
                component: () => import('@/views/roles/roleEdit'),
                meta: { title: 'roles', keepAlive: true, permission: ['admins'] }
              }
            ]
          },
          {
            path: '/permissions-new',
            name: 'permissions-new',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/permissions-new/list',
            meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] },
            children: [
              {
                path: '/permissions-new/list',
                name: 'PermissionsNewList',
                component: () => import('@/views/permissionsNew/PermissionsList'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              },
              {
                path: '/permissions-new/create',
                name: 'PermissionsNewCreate',
                component: () => import('@/views/permissionsNew/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              },
              {
                path: '/permissions-new/update/:id',
                name: 'PermissionsNewUpdate',
                component: () => import('@/views/permissionsNew/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permissions'] }
              }
            ]
          }
        ]
      },
      {
        path: '/pages',
        name: 'pages',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/pages/list',
        meta: { title: 'pages', keepAlive: true, icon: 'book', permission: ['pages'] },
        children: [
          {
            path: '/pages/list',
            name: 'PagesList',
            component: () => import('@/views/pages/PagesList'),
            meta: { title: 'pages', keepAlive: true, permission: ['pages'] }
          },
          {
            path: '/pages/create',
            name: 'PagesCreate',
            component: () => import('@/views/pages/PagesCreate'),
            meta: { title: 'pages', keepAlive: true, permission: ['pages'] }
          },
          {
            path: '/pages/update/:id',
            name: 'PagesUpdate',
            component: () => import('@/views/pages/PagesCreate'),
            meta: { title: 'pages', keepAlive: true, permission: ['pages'] }
          }
        ]
      },
      {
        path: '/1c',
        redirect: '/1c/update-prices',
        component: RouteView,
        meta: { title: 'c1', icon: 'ci', permission: ['1c'] },
        children: [
          {
            path: '/1c/update-prices',
            hideChildrenInMenu: true,
            name: 'UpdatePrices',
            component: RouteView,
            redirect: '/1c/update-prices/upload',
            meta: { title: 'update-prices', keepAlive: true, permission: ['1c'] },
            children: [
              {
                path: '/1c/update-prices/upload',
                name: 'UpdatePricesUpload',
                props: true,
                component: () => import('@/views/1c/UpdatePrices'),
                meta: { title: 'update-prices', keepAlive: true, permission: ['1c'] }
              }
            ]
          },
          {
            path: '/1c/update-quantity',
            hideChildrenInMenu: true,
            name: 'UpdateQuantity',
            component: RouteView,
            redirect: '/1c/update-quantity/upload',
            meta: { title: 'update-quantity', keepAlive: true, permission: ['1c'] },
            children: [
              {
                path: '/1c/update-quantity/upload',
                name: 'UpdateQuantityUpload',
                props: true,
                component: () => import('@/views/1c/UpdateQuantity'),
                meta: { title: 'update-quantity', keepAlive: true, permission: ['1c'] }
              }
            ]
          }
        ]
      },
      {
        path: '/account',
        name: 'account',
        component: RouteView,
        hidden: true,
        redirect: '/account',
        meta: { title: 'Account', keepAlive: true, icon: 'profile', permission: ['dashboard'] },
        children: [
          {
            path: '/account',
            name: 'account',
            component: () => import('@/views/account/UserAccount'),
            meta: { title: 'account', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
