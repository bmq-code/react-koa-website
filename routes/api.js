'use strict'

import koaRouter from 'koa-router'
import fs from 'fs'
const router = koaRouter()

/**
 * mongodb
 */
import mongoose from '../data/config' 
import articleModel from '../data/articles'
import categoryModel from '../data/categories'

/**
 * 获取博客列表
 */
const getBlogList = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/article.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

router.get('/blog/list/:page', async (ctx, next) => {
  let data
  try {
    data = await getBlogList()
  } catch (e) {
    throw e
  }
  ctx.res.writeHead(200, { 'Content-Type': 'application/json' })
  ctx.body = data
})

/**
 * 获取博客数目
 */
router.get('/blog/pagination/:page', async (ctx, next) => {
  let size = 10
  let page = + ctx.params.page
  /**
   * 获取文章总数
   */
  let data
  try {
    data = await getBlogList()
  } catch (e) {
    throw e
  }
  let length = JSON.parse(data).length
  let total = 10 // Math.ceil(length / size)
  /**
   * 计算分页
   */
  let pagination = {
    previous: 0,
    current: 1,
    next: 0
  }
  if (page > 0 && total >= page) {
      pagination.previous = page - 1
      pagination.current = page
      pagination.next = page === total ? 0 : page + 1
  } else {
    pagination = {
      code: '500',
      msg: 'params error'
    }
  }
  ctx.res.writeHead(200, { 'Content-Type': 'application/json' })
  ctx.body = pagination
})

/**
 * 增加文章
 */
router.post('/write', async (ctx) => {
  let article = JSON.parse(ctx.request.body.article)
  console.log(article)
  ctx.status = 200

  articleModel.create(article, err => {
    if (err) {
      console.log(err)
    } else {
      console.log('ok')
    }
  })
})

/**
 * 查询分类
 */
const getCategories = () => {
  return new Promise((resolve, reject) => {
    categoryModel.find({}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}
router.get('/category', async (ctx) => {
  ctx.res.writeHead(200, { 'Content-Type': 'application/json' })
  ctx.body = await getCategories()
})

/**
 * test
 */
router.post('/test/:param', ctx => {
  console.log(ctx.request.body)
  ctx.body = 'test'
})
router.get('/test/:param', ctx => {
  console.log(ctx.query)
  console.log(ctx.params)
  ctx.body = 'haha'
})

export default router