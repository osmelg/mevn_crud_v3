import Vue from 'vue'
import Router from 'vue-router'
import dashboard from './views/dashboard.vue'
import crearcomentario from './views/crearcomentario.vue'
import comentario from './views/comentario.vue'
import login from './views/login.vue'
import signup from './views/signup.vue'
import test from './views/test.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {path: '*', redirect:'/login'},
    { path: '/dashboard',name: 'dashboard',component: dashboard,meta:{requiresAuth:true}},
    { path: '/dashboard/crearcomentario',name: 'crearcomentario',component: crearcomentario,meta:{requiresAuth:true}},
    { path: '/dashboard/comentario/:id',name: 'comentario',component: comentario,meta:{requiresAuth:true}},
    { path: '/login',name: 'login',component: login},
    { path: '/signup',name: 'signup',component: signup},
    { path: '/test',name: 'test',component: test}
  ]
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if(to.matched.some(record => record.meta.requiresAuth)){
    if (token){
      // Entrar a la ruta para hacer verificacion del token del servidor con el del cliente
      next();
    }else{
      router.push('/login');
    }
  }else{
    next();
  }
})

export default router;