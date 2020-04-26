import puppeteer, { Browser, Page } from 'puppeteer'

export default class Crawler {
  from: string
  to: string
  content: string
  contentList: string[] = []
  loading = false
  resList: string[] = []
  index: number = 1
  constructor(from: string, to: string, content: string) {
    this.from = from
    this.to = to
    this.content = content
  }

  async typeWord(page: Page, word: string) {
    console.log(`translate: ${word}`)
    const input = await page.$('textarea#source')
    input && input.type(word)
  }

  addListen(browser: Browser, page: Page) {
    page.on('response', interceptedRes => {
      const resUrl = interceptedRes.url()
      if (/https:\/\/translate.google.cn\/translate_a\/single/.test(resUrl)) {
        interceptedRes.text().then(async (data) => {
          this.contentList[this.index] = JSON.parse(data)[0][0][0]
          await page.click('.clear')
          this.index = this.index + 2
          if (this.index + 1 < this.contentList.length) {
            setTimeout(() => {
              this.typeWord(page, this.contentList[this.index])
            }, 1000)
          } else {
            this.loading = false
            this.resList = this.contentList
            console.log('translated')
            browser.close()
          }
        })
      }
    })
  }

  async startTranslate() {
    this.resList = []
    this.loading = true
    console.log('translating...')
    const baseUrl = `https://translate.google.cn/#view=home&op=translate&sl=${this.from}&tl=${this.to}`
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(baseUrl)
    this.addListen(browser, page)
    this.contentList = this.content.split("'")
    this.typeWord(page, this.contentList[this.index])
  }
}