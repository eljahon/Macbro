
export default {
  navTheme: 'light', // theme for nav menu
  primaryColor: '#000000', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fixed', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, //  auto hide header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  collapsed: true,
  menu: {
    locale: true
  },
  title: 'UDevs',
  multiTab: false,
  pwa: false,
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}
