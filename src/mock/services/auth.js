import Mock from 'mockjs2'
import { builder } from '../util'

// const username = ['admin', 'super']
// // 强硬要求 ant.design 相同密码
// // '21232f297a57a5a743894a0e4a801fc3',
// const password = ['8914de686ab28dc22f30d3d8e107ff6c', '21232f297a57a5a743894a0e4a801fc3'] // admin, ant.design
const logout = () => {
  return builder({}, 'Logout succeeded')
}
Mock.mock(/\/auth\/logout/, 'post', logout)
