// module.exports = function flash (opts) {
//   let key = 'flash'
//   return async (ctx, next) => {
//     if (ctx.session === undefined) throw new Error('ctx.flash requires sessions')
//     let data = ctx.session[key]
//     ctx.session[key] = null
//     Object.defineProperty(ctx, 'flash', {
//       enumerabl: true,
//       get: () => data,
//       set: (val) => {
//         console.log(val)
//         ctx.session[key] = val
//       }
//     })
//     await next()
//   }
// }
module.exports = function flash (opts) {
  let key = 'flash'
  return async (ctx, next) => {
    if (ctx.session === undefined) throw new Error('ctx.flash requires sessions')
    let data = ctx.session[key]
    ctx.session[key] = null
    Object.defineProperty(ctx, 'flash', {
      enumerable: true,
      get: () => data,
      set: (val) => {
        ctx.session[key] = val
      }
    })
    await next()
  }
}
