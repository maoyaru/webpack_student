import Vue from 'vue';
import Router from 'vue-router';
// cris start
import homeworkRoute from '@/router/homework-router'
import orderRoute from '@/router/order-router'
// cris end
import {
  loadFromLocal
} from '@/common/js/store';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    };
  },
  routes: [{
      path: '/',
      name: 'index',
      component: resolve => require(['@/components/index/components/Main'], resolve),
      // children: [{
      //  path: 'group',
      //  name: 'group',
      //  component: resolve => require(['@/components/group/Group'], resolve)
      // },
      children: [{
          path: 'group',
          name: 'group',
          component: resolve => require(['@/components/myGroup'], resolve)
        },
        {
          path: 'home',
          name: 'home',
          component: resolve => require(['@/components/home/Home'], resolve)
        },
        {
          path: 'history',
          name: 'history',
          component: resolve => require(['@/components/history/History'], resolve)
        },
        {
          path: 'goodCourse',
          name: 'goodCourse',
          component: resolve => require(['@/components/goodCourse/goodCourse'], resolve)
        },
        {
          path: 'videoDetail',
          name: 'videoDetail',
          component: resolve => require(['@/components/goodCourse/videoCourseDetail'], resolve)
        },
        {
          path: 'unitReport',
          name: 'unitReport',
          component: resolve => require(['@/components/unitReport/unitReport'], resolve)
        },
        {
          path: 'firstClassReport',
          name: 'firstClassReport',
          component: resolve => require(['@/components/firstClassReport/firstClassReport'], resolve)
        },
        {
          path: 'booking',
          name: 'booking',
          component: resolve => require(['@/components/booking/Booking'], resolve)
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: resolve => require(['@/components/schedule/Schedule'], resolve)
        },
        {
          path: 'classschedulecard',
          name: 'classschedulecard',
          component: resolve => require(['@/components/ClassScheduleCard/classschedulecard'], resolve)
        },
        {
          path: 'detail',
          name: 'detail',
          component: resolve => require(['@/components/detail/Detail'], resolve)
        }
      ],
      redirect: '/home'
    },
    {
      path: '/pay',
      name: 'pay',
      component: resolve => require(['@/components/pay/index'], resolve),
      children: [{
          path: 'pays',
          name: 'pays',
          component: resolve => require(['@/components/pay/components/pay'], resolve)
        },
        {
          path: 'coupon',
          name: 'coupon',
          component: resolve => require(['@/components/pay/components/coupon'], resolve)
        },
        {
          path: 'billing',
          name: 'billing',
          component: resolve => require(['@/components/pay/components/billing'], resolve)
        },
        {
          path: 'paymentdetails',
          name: 'paymentdetails',
          component: resolve => require(['@/components/pay/components/paymentdetails'], resolve)
        },
        {
          path: 'paymentresult',
          name: 'paymentresult',
          component: resolve => require(['@/components/pay/components/paymentResult'], resolve)
        }
      ],
      redirect: '/pay/pays'
    },
    {
      path: '/smallclass',
      name: 'smallclass',
      component: resolve => require(['@/components/smallClass/SmallClass'], resolve)
    },
    {
      path: 'referfriends',
      name: 'referfriends',
      component: resolve => require(['@/components/pay/components/referfriends'], resolve)
    },
    {
      path: '/messageCenter',
      name: 'messageCenter',
      component: resolve => require(['@/components/messageCenter/messageCenter'], resolve)
    },
    {
      path: '/classroom',
      name: 'classroom',
      component: resolve => require(['@/components/plugin/Classroom'], resolve)
    },
    {
      path: '/enterclassroom',
      name: 'enterclassroom',
      component: resolve => require(['@/components/plugin/Enterclassroom'], resolve)
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: resolve => require(['@/components/LoginCom/index'], resolve)
    // },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: resolve => require(['@/components/LoginCom/components/RegisterForm'], resolve)
    // },
    {
      path: '/supplementuser',
      name: 'supplementuser',
      component: resolve => require(['@/components/supplementuser/supplementuser'], resolve)
    },
    {
      path: 'download',
      name: 'download',
      component: resolve => require(['@/components/download/Download'], resolve)
    },
    {
      path: '*',
      redirect: '/'
    }
  ].concat(homeworkRoute).concat(orderRoute)
})

router.beforeEach((to, from, next) => {

  let info = router.app.$options.store.state.user;
  const local = loadFromLocal('login_info', 'user', null);
  if (info.isLogin) {
    if (to.query.redirect) {
      if (decodeURIComponent(to.query.redirect).indexOf('billList.html') > -1) {
        window.location.href = '/billList.html';
        next();
      } else {
        next(decodeURIComponent(redirect));
      }
    } else {
      next();
    }

  } else if (local) {
    info.user = local;
    info.isLogin = true;
    next();
  } else if (to.path == '/login' || to.path == '/register') {
    next();
  } else if (!info.isLogin) {
    // next({
    //   path: '/login',
    //   query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
    // })
    next();
    window.location.href = '/login.html?redirect=' + encodeURIComponent(to.fullPath);
  } else {
    next();
  }

})
// 解决重复点击导航路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}
export default router;
