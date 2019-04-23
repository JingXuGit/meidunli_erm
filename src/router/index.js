import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home/home'
import Welcome from '@/components/home/welcome'
import User from '@/components/user/user'
import Cases from '@/components/cases/cases'
import Speaker from '@/components/user/speaker'
import Cases_detail from '@/components/cases/cases_detail'
import Cases_detail_edit from '@/components/cases/cases_detail_edit'
import Speaker_detail from '@/components/user/speaker_detail'

Vue.use(Router)

const router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/Welcome',
      children: [
        { path: '/Welcome', component: Welcome },
        { path: '/User', component: User },
        { path: '/Cases', component: Cases },
        { path: '/Speaker', component: Speaker },
        { path: '/Cases_detail', component: Cases_detail },
        { path: '/Cases_detail_edit', component: Cases_detail_edit },
        { path: '/Speaker_detail', component: Speaker_detail },
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // 如果访问的 login 页面，直接放行
  let token = window.localStorage.getItem("token");
  if (to.path === '/') {
    if (token) {
      return next({
        path: '/welcome'
      })
    }
    return next();
  }
  // 获取 token 字符串
  // 如果没有 token 字符串，强制跳转到 登录页
  if (!token) return next('/')
  // 证明有 token 字符串，直接放行
  next()
})
export default router