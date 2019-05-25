const router = require('koa-router')()

// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 2!'
//   })
// })

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })
async function isLoginUser (ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = { warning: '未登录，请先登录' }
    return ctx.redirect('/signin')
  }
  await next()
}

// async function isAdmin (ctx, next) {
//   console.log(ctx.session)
//   if (!ctx.session.user) {
//     ctx.flash = { warning: '未登录，请先登录' }
//     return ctx.redirect('/signin')
//   }
//   if (!ctx.session.user.isAdmin) {
//     ctx.flash = { warning: '没有权限' }
//     return ctx.redirect('back')
//   }
//   await next()
// }

module.exports = (app) => {
  router.get('/', require('./posts.js').index)
  router.get('/signup', require('./users.js').signup)
  router.post('/signup', require('./users.js').signup)
  router.get('/signin', require('./users.js').signin)
  router.post('/signin', require('./users.js').signin)
  router.get('/signout', require('./users.js').signout)
  router.get('/posts', require('./posts.js').index)
  router.get('/posts/new', isLoginUser, require('./posts.js').create)
  router.post('/posts/new', isLoginUser, require('./posts.js').create)
  router.get('/posts/:id', require('./posts.js').show)
  router.get('/posts/:id/edit', require('./posts.js').edit)
  router.post('/posts/:id/edit', require('./posts.js').edit)
  router.get('/posts/:id/delete', require('./posts.js').destory)
  app.use(router.routes(), router.allowedMethods())
}
