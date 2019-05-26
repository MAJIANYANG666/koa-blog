const Koa = require('koa')
const path = require('path')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const error = require('./middlewares/error_handler')
const router = require('./routes/index')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')
const session = require('koa-session')
const flash = require('./middlewares/flash')
const marked = require('marked')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pendantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

app.use(error())

mongoose.connect(CONFIG.mongodb)
app.use(flash())

app.keys = ['something']

app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.join(__dirname, '/public')))

app.use(views(path.join(__dirname, '/views'), {
  // extension: 'ejs'
  map: { html: 'nunjucks' }
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.marked = marked
  await next()
})
// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
router(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
