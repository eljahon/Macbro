// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
// import UserAccount from '@/views/account/UserAccount'
import myIcons from '@/core/icons'

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
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Analysis'),
        hideChildrenInMenu: true,
        meta: { title: 'dashboard', keepAlive: true, icon: myIcons.dashboard, permission: ['dashboard'] }
      },
      {
        path: '/orders',
        name: 'orders',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/orders/list',
        meta: { title: 'orders', keepAlive: true, show: true, icon: myIcons.orders, permission: ['order'] },
        children: [
          {
            path: '/orders/list',
            name: 'OrdersList',
            component: () => import('@/views/orders/OrdersList'),
            meta: { title: 'orders', keepAlive: true, permission: ['order'] }
          },
          {
            path: '/order/details/:id',
            name: 'OrderDetails',
            component: () => import('@/views/orders/OrderDetails'),
            meta: { title: 'detail', keepAlive: true, show: true, permission: ['order'] }
          },
          {
            path: '/order/edit/:id',
            name: 'OrderEdit',
            component: () => import('@/views/orders/OrderEdit'),
            meta: { title: 'update', keepAlive: true, show: true, permission: ['order'] }
          }
        ]
      },
      {
        path: '/customers',
        name: 'customers',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/customers/list',
        meta: { title: 'customers', keepAlive: true, show: true, icon: myIcons.clients, permission: ['clients'] },
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
            meta: { title: 'update', keepAlive: true, show: true, permission: ['clients'] }
          }
        ]
      },
      {
        path: '/city',
        name: 'city',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/city/list',
        meta: { title: 'cities', keepAlive: true, show: true, icon: 'environment', permission: ['cities'] },
        children: [
          {
            path: '/city/list',
            name: 'citiesList',
            component: () => import('@/views/city/cityList'),
            meta: { title: 'cities', keepAlive: true, permission: ['cities'] }
          },
          {
            path: '/city/create',
            name: 'citiesCreate',
            component: () => import('@/views/city/cityEdit'),
            meta: { title: 'create', keepAlive: true, show: true, permission: ['cities'] }
          },
          {
            path: '/city/update/:id',
            name: 'citiesEdit',
            component: () => import('@/views/city/cityEdit'),
            meta: { title: 'update', keepAlive: true, show: true, permission: ['cities'] }
          }
        ]
      },
      {
        path: '/company',
        name: 'company',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/company/list',
        meta: { title: 'companies', keepAlive: true, show: true, icon: 'bank', permission: ['company'] },
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
            meta: { title: 'add', keepAlive: true, show: true, permission: ['company'] }
          },
          {
            path: '/company/update/:id',
            name: 'CompaniesEdit',
            component: () => import('@/views/companies/CompaniesEdit'),
            meta: { title: 'update', keepAlive: true, show: true, permission: ['company'] }
          },
          {
            path: '/company/update/:company_id/branch/create',
            name: 'branchesCreate',
            component: () => import('@/views/companies/branches/BranchesEdit'),
            meta: { title: 'add', keepAlive: true, show: true, permission: ['company'] }
          },
          {
            path: '/branch/update/:id',
            name: 'BranchesEdit',
            component: () => import('@/views/companies/branches/BranchesEdit'),
            meta: { title: 'update', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/update/:company_id/corporate/create',
            name: 'corporateCreate',
            component: () => import('@/views/companies/corporate/CorporateEdit'),
            meta: { title: 'add', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/corporate/update/:id',
            name: 'corporateEdit',
            component: () => import('@/views/companies/corporate/CorporateEdit'),
            meta: { title: 'update', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/company/update/:company_id/warehouse/create',
            name: 'warehouseCreate',
            component: () => import('@/views/companies/warehouse/WarehouseEdit'),
            meta: { title: 'add', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/warehouse/update/:id',
            name: 'warehouseEdit',
            component: () => import('@/views/companies/warehouse/WarehouseEdit'),
            meta: { title: 'update', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/warehouse/update/:warehouse_id/items/create',
            name: 'inventoryItemCreate',
            component: () => import('@/views/companies/warehouse/inventoryitem/InventoryItemEdit'),
            meta: { title: 'add', keepAlive: true, permission: ['company'] }
          },
          {
            path: '/warehouse/update/:warehouse_id/item/:id/update',
            name: 'inventoryItemEdit',
            component: () => import('@/views/companies/warehouse/inventoryitem/InventoryItemEdit'),
            meta: { title: 'update', keepAlive: true, permission: ['company'] }
          }
        ]
      },
      {
        path: '/directory',
        redirect: '/categories',
        component: RouteView,
        meta: { title: 'directory', icon: myIcons.directory, permission: ['directory'] },
        children: [
          {
            path: '/catalog',
            redirect: '/catalog/categories',
            component: RouteView,
            meta: { title: 'catalog', icon: myIcons.directoryCatalog, permission: ['directory'] },
            children: [
              {
                path: '/catalog/categories',
                hideChildrenInMenu: true,
                name: 'CategoriesList',
                component: RouteView,
                redirect: '/catalog/categories/list',
                meta: { title: 'categories', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/categories/list',
                    name: 'CategoriesListMain',
                    props: true,
                    component: () => import('@/views/categories/CategoriesList'),
                    meta: { title: 'categories', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/categories/create',
                    name: 'CategoriesCreate',
                    props: true,
                    component: () => import('@/views/categories/CategoriesCreate'),
                    meta: { title: 'categories', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/categories/update/:id',
                    name: 'CatagoriesUpdate',
                    props: true,
                    component: () => import('@/views/categories/CategoriesCreate'),
                    meta: { title: 'categories', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/catalog/attribute',
                hideChildrenInMenu: true,
                name: 'ProductAttributes',
                component: RouteView,
                redirect: '/catalog/attribute/list',
                meta: { title: 'attribute', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/attribute/list',
                    name: 'AttributeList',
                    props: true,
                    component: () => import('@/views/attributes/AttributesList'),
                    meta: { title: 'attribute', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/attribute/create',
                    name: 'AttributeCreate',
                    props: true,
                    component: () => import('@/views/attributes/AttributesCreate'),
                    meta: { title: 'attribute', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/attribute/update/:id',
                    name: 'AttributeEdit',
                    props: true,
                    component: () => import('@/views/attributes/AttributesCreate'),
                    meta: { title: 'attribute', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/catalog/brands',
                hideChildrenInMenu: true,
                name: 'BrandsList',
                component: RouteView,
                redirect: '/catalog/brands/list',
                meta: { title: 'brands', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/brands/list',
                    name: 'BrandsListMain',
                    props: true,
                    component: () => import('@/views/brands/BrandsList'),
                    meta: { title: 'brands', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/brands/create',
                    name: 'BrandsCreate',
                    props: true,
                    component: () => import('@/views/brands/BrandsCreate'),
                    meta: { title: 'brands', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/brands/update/:id',
                    name: 'BrandsUpdate',
                    props: true,
                    component: () => import('@/views/brands/BrandsCreate'),
                    meta: { title: 'brands', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/catalog/products',
                hideChildrenInMenu: true,
                name: 'Product',
                component: RouteView,
                redirect: '/catalog/products/list',
                meta: { title: 'products', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/products/list',
                    name: 'ProductsList',
                    component: () => import('@/views/products/ProductsList'),
                    meta: { title: 'products', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/products/create',
                    name: 'ProductsCreate',
                    component: () => import('@/views/products/ProductsCreate'),
                    meta: { title: 'products', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/products/update/:id',
                    name: 'ProductsUpdate',
                    component: () => import('@/views/products/ProductsCreate'),
                    meta: { title: 'products', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/catalog/product-variants',
                hideChildrenInMenu: true,
                name: 'ProductVariant',
                component: RouteView,
                redirect: '/catalog/product-variants/list',
                meta: { title: 'product_variants', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/product-variants/list',
                    name: 'ProductVariantsList',
                    component: () => import('@/views/product-variants/ProductVariantsList'),
                    meta: { title: 'product_variants', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/product-variants/create',
                    name: 'ProductVariantsCreate',
                    component: () => import('@/views/product-variants/ProductVariantsCreate'),
                    meta: { title: 'product_variants', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/product-variants/update/:id',
                    name: 'ProductVariantsUpdate',
                    component: () => import('@/views/product-variants/ProductVariantsCreate'),
                    meta: { title: 'product_variants', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/catalog/featured-products',
                name: 'Featured Products',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/catalog/featured-products/list',
                meta: { title: 'featured-products', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/catalog/featured-products/list',
                    name: 'FeaturedProductsList',
                    component: () => import('@/views/featured/FeaturedProductsList'),
                    meta: { title: 'featured-products', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/featured-products/create',
                    name: 'FeaturedProductsCreate',
                    component: () => import('@/views/featured/FeaturedProductsCreate'),
                    meta: { title: 'featured-products', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/catalog/featured-products/update/:id',
                    name: 'FeaturedProductsEdit',
                    component: () => import('@/views/featured/FeaturedProductsCreate'),
                    meta: { title: 'featured-products', keepAlive: true, permission: ['directory'] }
                  }
                ]
              }
            ]
          },
          {
            path: '/promos',
            name: 'promos',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/promos/list',
            meta: { title: 'promos', keepAlive: true, icon: myIcons.directoryStock, permission: ['directory'] },
            children: [
              {
                path: '/promos/list',
                name: 'PromosList',
                component: () => import('@/views/promos/PromosList'),
                meta: { title: 'promos', keepAlive: true, permission: ['directory'] }
              },
              {
                path: '/promos/create',
                name: 'PromosCreate',
                component: () => import('@/views/promos/PromosCreate'),
                meta: { title: 'promos', keepAlive: true, permission: ['directory'] }
              },
              {
                path: '/promos/update/:id',
                name: 'PromosUpdate',
                component: () => import('@/views/promos/PromosCreate'),
                meta: { title: 'promos', keepAlive: true, permission: ['directory'] }
              }
            ]
          },
          {
            path: '/agents',
            name: 'agents',
            component: RouteView,
            redirect: '/agents/physical',
            meta: { title: 'counterAgents', keepAlive: true, icon: myIcons.directoryCounterAgents, permission: ['directory'] },
            children: [
              {
                path: '/agents/physical',
                name: 'agentsPhysical',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/agents/physical/list',
                meta: { title: 'physicalAgents', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/agents/physical/list',
                    name: 'physicalAgentList',
                    component: () => import('@/views/agents/physical/physicalAgentList'),
                    meta: { title: 'physicalAgents', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/agents/physical/create',
                    name: 'physicalAgentCreate',
                    component: () => import('@/views/agents/physical/physicalAgentEdit'),
                    meta: { title: 'physicalAgents', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/agents/physical/update/:id',
                    name: 'physicalAgentUpdate',
                    component: () => import('@/views/agents/physical/physicalAgentEdit'),
                    meta: { title: 'physicalAgents', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/agents/legal',
                name: 'agentsLegal',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/agents/legal/list',
                meta: { title: 'legalAgents', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/agents/legal/list',
                    name: 'agentsLegalList',
                    component: () => import('@/views/agents/legal/legalAgentList'),
                    meta: { title: 'legalAgents', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/agents/legal/create',
                    name: 'agentsLegalCreate',
                    component: () => import('@/views/agents/legal/legalAgentEdit'),
                    meta: { title: 'legalAgents', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/agents/legal/update/:id',
                    name: 'agentsLegalUpdate',
                    component: () => import('@/views/agents/legal/legalAgentEdit'),
                    meta: { title: 'legalAgents', keepAlive: true, permission: ['directory'] }
                  }
                ]
              }
            ]
          },
          {
            path: '/directory/content',
            redirect: '/news',
            component: RouteView,
            meta: { title: 'contentPages', icon: myIcons.directoryContent, permission: ['directory'] },
            children: [
              {
                path: '/news',
                name: 'news',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/news/list',
                meta: { title: 'news', keepAlive: true, icon: 'read', permission: ['directory'] },
                children: [
                  {
                    path: '/news/list',
                    name: 'NewsList',
                    component: () => import('@/views/news/NewsList'),
                    meta: { title: 'news', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/news/create',
                    name: 'NewsCreate',
                    component: () => import('@/views/news/NewsCreate'),
                    meta: { title: 'news', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/news/update/:id',
                    name: 'NewsUpdate',
                    component: () => import('@/views/news/NewsCreate'),
                    meta: { title: 'news', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/banner',
                name: 'banner',
                component: RouteView,
                redirect: '/banners',
                meta: { title: 'banners', keepAlive: true, icon: 'picture', permission: ['directory'] },
                children: [
                  {
                    path: '/banners',
                    name: 'banners',
                    component: RouteView,
                    hideChildrenInMenu: true,
                    redirect: '/banners/list',
                    meta: { title: 'banners', keepAlive: true, show: true, permission: ['directory'] },
                    children: [
                      {
                        path: '/banners/list',
                        name: 'BannersList',
                        component: () => import('@/views/banners/BannersList'),
                        meta: { title: 'banners', keepAlive: true, permission: ['directory'] }
                      },
                      {
                        path: '/banners/create',
                        name: 'BannersCreate',
                        component: () => import('@/views/banners/BannersCreate'),
                        meta: { title: 'banners', keepAlive: true, show: true, permission: ['directory'] }
                      },
                      {
                        path: '/banners/update/:id',
                        name: 'BannersUpdate',
                        component: () => import('@/views/banners/BannersCreate'),
                        meta: { title: 'banners', keepAlive: true, show: true, permission: ['directory'] }
                      }
                    ]
                  },
                  {
                    path: '/banner-positions',
                    name: 'banner-positions',
                    component: RouteView,
                    hideChildrenInMenu: true,
                    redirect: '/banner-positions/list',
                    meta: { title: 'bannerPositions', keepAlive: true, show: true, permission: ['directory'] },
                    children: [
                      {
                        path: '/banner-positions/list',
                        name: 'BannerPositionsList',
                        component: () => import('@/views/banner-positions/BannerPositionsList'),
                        meta: { title: 'banner-positions', keepAlive: true, permission: ['directory'] }
                      },
                      {
                        path: '/banner-positions/create',
                        name: 'BannerPositionsCreate',
                        component: () => import('@/views/banner-positions/BannerPositionsCreate'),
                        meta: { title: 'banner-positions', keepAlive: true, show: true, permission: ['directory'] }
                      },
                      {
                        path: '/banner-positions/update/:id',
                        name: 'BannerPositionsUpdate',
                        component: () => import('@/views/banner-positions/BannerPositionsCreate'),
                        meta: { title: 'banner-positions', keepAlive: true, show: true, permission: ['directory'] }
                      }
                    ]
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
            meta: { title: 'adminstrators', keepAlive: true, icon: myIcons.directoryCounterAgents, permission: ['directory'] },
            children: [
              {
                path: '/admins',
                name: 'admins',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/admins/list',
                meta: { title: 'admins', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/admins/list',
                    name: 'AdminsList',
                    component: () => import('@/views/admins/AdminsList'),
                    meta: { title: 'admins', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/admins/create',
                    name: 'AdminsCreate',
                    component: () => import('@/views/admins/AdminsCreate'),
                    meta: { title: 'admins', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/admins/update/:id',
                    name: 'AdminsUpdate',
                    component: () => import('@/views/admins/AdminsCreate'),
                    meta: { title: 'admins', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/permissions',
                name: 'permissions',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/permissions/list',
                meta: { title: 'permissions', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/permissions/list',
                    name: 'PermissionsList',
                    component: () => import('@/views/permissions/PermissionsList'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/permissions/create',
                    name: 'PermissionsCreate',
                    component: () => import('@/views/permissions/PermissionsCreate'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/permissions/update/:id',
                    name: 'PermissionsUpdate',
                    component: () => import('@/views/permissions/PermissionsCreate'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/staff',
                name: 'staff',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/staff/list',
                meta: { title: 'staff', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/staff/list',
                    name: 'staffList',
                    component: () => import('@/views/staff/staffList'),
                    meta: { title: 'staff', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/staff/create',
                    name: 'staffCreate',
                    component: () => import('@/views/staff/staffEdit'),
                    meta: { title: 'staff', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/staff/update/:id',
                    name: 'staffUpdate',
                    component: () => import('@/views/staff/staffEdit'),
                    meta: { title: 'staff', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/roles',
                name: 'roles',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/roles/list',
                meta: { title: 'roles', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/roles/list',
                    name: 'rolesList',
                    component: () => import('@/views/roles/roleList'),
                    meta: { title: 'roles', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/roles/create',
                    name: 'rolesCreate',
                    component: () => import('@/views/roles/roleEdit'),
                    meta: { title: 'roles', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/roles/update/:id',
                    name: 'rolesUpdate',
                    component: () => import('@/views/roles/roleEdit'),
                    meta: { title: 'roles', keepAlive: true, permission: ['directory'] }
                  }
                ]
              },
              {
                path: '/permissions-new',
                name: 'permissions-new',
                component: RouteView,
                hideChildrenInMenu: true,
                redirect: '/permissions-new/list',
                meta: { title: 'permissions', keepAlive: true, permission: ['directory'] },
                children: [
                  {
                    path: '/permissions-new/list',
                    name: 'PermissionsNewList',
                    component: () => import('@/views/permissionsNew/PermissionsList'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/permissions-new/create',
                    name: 'PermissionsNewCreate',
                    component: () => import('@/views/permissionsNew/PermissionsCreate'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
                  },
                  {
                    path: '/permissions-new/update/:id',
                    name: 'PermissionsNewUpdate',
                    component: () => import('@/views/permissionsNew/PermissionsCreate'),
                    meta: { title: 'permissions', keepAlive: true, permission: ['directory'] }
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
            meta: { title: 'pages', keepAlive: true, icon: myIcons.directoryPages, permission: ['directory'] },
            children: [
              {
                path: '/pages/list',
                name: 'PagesList',
                component: () => import('@/views/pages/PagesList'),
                meta: { title: 'pages', keepAlive: true, permission: ['directory'] }
              },
              {
                path: '/pages/create',
                name: 'PagesCreate',
                component: () => import('@/views/pages/PagesCreate'),
                meta: { title: 'pages', keepAlive: true, permission: ['directory'] }
              },
              {
                path: '/pages/update/:id',
                name: 'PagesUpdate',
                component: () => import('@/views/pages/PagesCreate'),
                meta: { title: 'pages', keepAlive: true, permission: ['directory'] }
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
        meta: { title: 'shops', keepAlive: true, show: true, icon: myIcons.branches, permission: ['shops'] },
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
            meta: { title: 'add', keepAlive: true, show: true, permission: ['shops'] }
          },
          {
            path: '/shops/update/:id',
            name: 'ShopsUpdate',
            component: () => import('@/views/shops/ShopsCreate'),
            meta: { title: 'update', keepAlive: true, show: true, permission: ['shops'] }
          }
        ]
      },
      {
        path: '/inventory',
        name: 'inventory',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/inventory/list',
        meta: { title: 'inventory', keepAlive: true, icon: myIcons.warehouse, permission: ['warehouse'] },
        children: [
          {
            path: '/inventory/list',
            name: 'inventoryList',
            component: () => import('@/views/inventory/inventoryList'),
            meta: { title: 'inventory', keepAlive: true, permission: ['warehouse'] }
          },
          {
            path: '/inventory/create',
            name: 'inventoryCreate',
            component: () => import('@/views/inventory/inventoryCreate'),
            meta: { title: 'inventory', keepAlive: true, permission: ['warehouse'] }
          },
          {
            path: '/inventory/update/:id',
            name: 'inventoryUpdate',
            component: () => import('@/views/inventory/inventoryCreate'),
            meta: { title: 'inventory', keepAlive: true, permission: ['warehouse'] }
          }
        ]
      },
      // {
      //   path: '/1c',
      //   redirect: '/1c/update-prices',
      //   component: RouteView,
      //   meta: { title: 'c1', icon: 'ci', permission: ['1c'] },
      //   children: [
      //     {
      //       path: '/1c/update-prices',
      //       hideChildrenInMenu: true,
      //       name: 'UpdatePrices',
      //       component: RouteView,
      //       redirect: '/1c/update-prices/upload',
      //       meta: { title: 'update-prices', keepAlive: true, permission: ['1c'] },
      //       children: [
      //         {
      //           path: '/1c/update-prices/upload',
      //           name: 'UpdatePricesUpload',
      //           props: true,
      //           component: () => import('@/views/1c/UpdatePrices'),
      //           meta: { title: 'update-prices', keepAlive: true, permission: ['1c'] }
      //         }
      //       ]
      //     },
      //     {
      //       path: '/1c/update-quantity',
      //       hideChildrenInMenu: true,
      //       name: 'UpdateQuantity',
      //       component: RouteView,
      //       redirect: '/1c/update-quantity/upload',
      //       meta: { title: 'update-quantity', keepAlive: true, permission: ['1c'] },
      //       children: [
      //         {
      //           path: '/1c/update-quantity/upload',
      //           name: 'UpdateQuantityUpload',
      //           props: true,
      //           component: () => import('@/views/1c/UpdateQuantity'),
      //           meta: { title: 'update-quantity', keepAlive: true, permission: ['1c'] }
      //         }
      //       ]
      //     }
      //   ]
      // },
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
            name: 'accountDetail',
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
