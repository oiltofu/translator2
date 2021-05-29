import { Router } from 'express'
import Crawler from './utils/crawler'

let crawler: Crawler

const router = Router()

router.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="padding-top: 100px;text-align: center;">
        <form method="post" action="/translate">
          from
          <select name="from">
            <option value="zh">zh</option>
            <option value="en">en</option>
            <option value="jp">jp</option>
            <option value="cht">cht</option>
          </select>
          to
          <select name="to">
            <option value="cht">cht</option>
            <option value="zh">zh</option>
            <option value="en">en</option>
            <option value="jp">jp</option>
          </select>
          <textarea style="display: block; margin: 0 auto; margin-top: 36px;" name="content" rows="30" cols="180" placeholder="要翻译的内容"></textarea>
          <div style="margin-top: 36px;">
            <button>翻译</button>
          </div>
        </form>
      </body>
    </html>
  `)
})

router.post('/translate', (req, res) => {
  const { from, to, content } = req.body
  if (!content) {
    res.send('空数据')
  } else {
    crawler = new Crawler(from, to, content)
    crawler.startTranslate()
    res.send(`
      <div style="text-align: center;">
        正在翻译中，翻译完成命令行会有log
        <a href="/getData">查看结果</a>
      </div>
    `)
  }
})

router.get('/getData', (req, res) => {
  if (crawler.loading) {
    res.send(`
      <div style="text-align: center;">
        翻译还未完成，翻译完成命令行会有log
        <a href="/getData">刷新</a>
      </div>
    `)
  } else {
    res.send(`
      <textarea style="display: block; margin: 0 auto; margin-top: 36px;" name="content" rows="30" cols="180" readonly>${crawler.resList.join("'")}</textarea>
    `)
  }
})

export default router