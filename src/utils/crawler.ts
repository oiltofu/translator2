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
    const input = await page.$('textarea#baidu_translate_input')
    input && input.type(word)
  }

  // 谷歌翻译
  // addListen(browser: Browser, page: Page) {
  //   page.on('response', interceptedRes => {
  //     const resUrl = interceptedRes.url()
  //     if (/https:\/\/translate.google.cn\/translate_a\/single/.test(resUrl)) {
  //       interceptedRes.text().then(async (data) => {
  //         this.contentList[this.index] = JSON.parse(data)[0][0][0]
  //         await page.click('.clear')
  //         this.index = this.index + 2
  //         if (this.index + 1 < this.contentList.length) {
  //           setTimeout(() => {
  //             this.typeWord(page, this.contentList[this.index])
  //           }, 1000)
  //         } else {
  //           this.loading = false
  //           this.resList = this.contentList
  //           console.log('translated')
  //           browser.close()
  //         }
  //       })
  //     }
  //   })
  // }

  // 百度翻译
  addListen(browser: Browser, page: Page) {
    page.on('response', interceptedRes => {
      const resUrl = interceptedRes.url()
      if (/https:\/\/fanyi.baidu.com\/v2transapi/.test(resUrl)) {
        interceptedRes.text().then(async (data) => {
          this.contentList[this.index] = JSON.parse(data).trans_result.data[0].dst
          await page.keyboard.type('');
          await page.keyboard.down('Shift');
          for (let i = 0; i < this.contentList[this.index].length; i++)
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.up('Shift');
          await page.keyboard.press('Backspace');
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
    // const baseUrl = `https://translate.google.cn/#view=home&op=translate&sl=${this.from}&tl=${this.to}`
    // const baseUrl = `https://translate.google.cn/?sl=${this.from}&tl=${this.to}&op=translate`
    const baseUrl = `https://fanyi.baidu.com/?aldtype=16047#${this.from}/${this.to}/`
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(baseUrl)
    this.addListen(browser, page)
    this.contentList = this.content.split("'")
    this.typeWord(page, this.contentList[this.index])
  }
}