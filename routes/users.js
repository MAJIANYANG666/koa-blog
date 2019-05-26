// const router = require('koa-router')()
const UserModel = require('../models/user')
const bcrypt = require('bcryptjs')

// router.prefix('/users')
// 注册时存储用户信息，登录的时候根据用户名在数据库查询用户，并对比密码，设置session返回，之后浏览器每次带上cookie(sessionid)，以此来判断是否是用户。
module.exports = {
  async signup (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signup', {
        title: '用户注册'
      })
      return
    }
    const salt = await bcrypt.genSalt(10)
    let { name, email, password } = ctx.request.body
    password = await bcrypt.hash(password, salt)
    const user = {
      name,
      email,
      password
    }
    await UserModel.create(user)
    // ctx.body = result
    ctx.redirect('/signin')
  },
  async signin (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signin', {
        title: '用户登录'
      })
      return
    }
    const { name, password } = ctx.request.body
    const user = await UserModel.findOne({ name })
    if (user && await bcrypt.compare(password, user.password)) {
      ctx.session.user = {
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        email: user.email
      }
      ctx.redirect('/')
    } else {
      ctx.body = '用户名或密码错误'
    }
  },
  signout (ctx, next) {
    ctx.session.user = null
    ctx.flash = { warning: '退出登录' }
    ctx.redirect('/')
  }
}
