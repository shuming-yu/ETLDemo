import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },

    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [
        {
          path: "",
          component: () => import("@/pages/Index.vue"),
        },
        {
          path: "ETL",
          children: [
            {
              path: "ETLReload",
              component: () => import("@/pages/ETL/ETLReload.vue"),
              meta: { requireAuth: true, icon: "sym_o_overview" },
            },
            {
              path: "QueryETLData",
              component: () => import("@/pages/ETL/QueryETLData.vue"),
              meta: { requireAuth: true, icon: "sym_o_quick_reference_all" },
            },
            {
              path: "ETLFlow/STAGE",
              component: () => import("@/pages/ETL/STAGE_ETLRelation.vue"),
              meta: { requireAuth: false, icon: "sym_o_rebase_edit" },
              // meta: { requireAuth: true, icon: "sym_o_rebase_edit" },
            },
            {
              path: "ETLDiagram/STAGE",
              component: () => import("@/pages/ETL/STAGE_ETLDiagram.vue"),
              meta: { requireAuth: false },
            },
            {
              path: "ETLFlow/PRD",
              component: () => import("@/pages/ETL/PRD_ETLRelation.vue"),
              meta: { requireAuth: false, icon: "sym_o_flowsheet" },
              // meta: { requireAuth: true, icon: "sym_o_flowsheet" },
            },
            {
              path: "ETLDiagram/PRD",
              component: () => import("@/pages/ETL/PRD_ETLDiagram.vue"),
              meta: { requireAuth: false },
            },
          ],
        },
      ]
    },

    // Always leave this as last one,
    // but you can also remove it
    // {
    //   path: "/:catchAll(.*)*",
    //   component: () => import("@/pages/ErrorNotFound.vue"),
    // },
  ],
})

export default router
