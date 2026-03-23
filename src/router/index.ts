import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import SimplePageView from '../views/SimplePageView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/san-pham/:slug',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/mui-vat-mep-centering-2cen',
      redirect: { name: 'product-detail', params: { slug: 'mui-vat-mep-centering-2cen' } },
    },
    {
      path: '/ve-chung-toi',
      name: 'about',
      component: SimplePageView,
      meta: { title: 'Về chúng tôi' },
    },
    {
      path: '/doi-tac',
      name: 'partners',
      component: SimplePageView,
      meta: { title: 'Đối tác' },
    },
    {
      path: '/tai-lieu',
      name: 'docs',
      component: SimplePageView,
      meta: { title: 'Tài liệu' },
    },
    {
      path: '/tin-tuc',
      name: 'news',
      component: SimplePageView,
      meta: { title: 'Tin tức' },
    },
    {
      path: '/lien-he',
      name: 'contact',
      component: SimplePageView,
      meta: { title: 'Liên hệ' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
