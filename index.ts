import { createApp, defineComponent, nextTick } from 'vue'
import Clipboard from 'clipboard'
import JSON5 from 'json5'
import { indexTemplateHtml } from './variables'
import { Locale, RelativeTime } from 'relative-time-vue-component'

new Clipboard('.clipboard')

const itemsKeyName = 'todo.items'
const reportFormatKeyName = 'todo.report.format'
const initialItems = localStorage.getItem(itemsKeyName)
let locale: Locale | null = null

const App = defineComponent({
  render: indexTemplateHtml,
  data: () => {
    return {
      items: (initialItems ? JSON.parse(initialItems) : []) as Item[],
      newItemContent: '',
      editingIndex: null as number | null,
      result: '',
      canImport: false,
      reportFormatIsEditing: false,
      reportDays: 0.5,
      reportDaysIsEditing: false,
      locale,
      clearItemTimespan: 7 * 24 * 60 * 60 * 1000,
      hoveringIndex: null as number | null,
      internalReportFormat: localStorage.getItem(reportFormatKeyName) || '[year]-[month]-[day]([week]): [content]'
    }
  },
  computed: {
    reportFormat: {
      get(): string {
        return this.internalReportFormat
      },
      set(format: string) {
        this.internalReportFormat = format
        localStorage.setItem(reportFormatKeyName, format)
      },
    },
    editingItemContent: {
      get(): Item | string {
        return this.editingIndex !== null ? this.items[this.editingIndex].content : ''
      },
      set(content: string) {
        if (this.editingIndex !== null) {
          this.items[this.editingIndex].content = content
          this.save()
        }
      }
    },
    canClearItems(): boolean {
      return this.items.length > 0 && this.items.some(item => !!item.date && Date.now() - item.date >= this.clearItemTimespan)
    }
  },
  methods: {
    getSpanedContent(item: Item) {
      return item.content.split('').map(c => `<span>${c}</span>`).join('')
    },
    toggleReportFormatVisibility() {
      this.reportFormatIsEditing = !this.reportFormatIsEditing
      if (this.reportFormatIsEditing) {
        nextTick(() => {
          const reportFormatElement = document.getElementById('reportFormat')
          if (reportFormatElement) {
            reportFormatElement.focus()
          }
        })
      }
    },
    toggleReportDaysVisibility() {
      this.reportDaysIsEditing = !this.reportDaysIsEditing
      if (this.reportDaysIsEditing) {
        nextTick(() => {
          const reportDaysElement = document.getElementById('reportDays')
          if (reportDaysElement) {
            reportDaysElement.focus()
          }
        })
      }
    },
    create() {
      if (this.newItemContent && this.newItemContent.trim()) {
        this.items.unshift({
          status: 'open',
          content: this.newItemContent.trim()
        })
        this.save()
        this.newItemContent = ''
      }
    },
    mouseenter(index: number) {
      this.hoveringIndex = index
    },
    mouseleave() {
      this.hoveringIndex = null
    },
    canClose(index: number) {
      return this.hoveringIndex === index
        && this.editingIndex === null
        && (this.items[index].status === 'open' || this.items[index].status === 'doing')
    },
    close(item: Item) {
      item.status = 'closed'
      item.date = Date.now()
      this.save()
    },
    canOnIt(index: number) {
      return this.hoveringIndex === index
        && this.editingIndex === null
        && this.items[index].status === 'open'
    },
    onIt(item: Item) {
      item.status = 'doing'
      this.save()
    },
    canDone(index: number) {
      return this.canClose(index)
    },
    done(item: Item) {
      item.status = 'done'
      item.date = Date.now()
      this.save()
    },
    canReopen(index: number) {
      return this.hoveringIndex === index
        && this.editingIndex === null
        && (this.items[index].status === 'done' || this.items[index].status === 'closed')
    },
    reopen(item: Item) {
      item.status = 'open'
      this.save()
    },
    edit(index: number, e?: MouseEvent) {
      let position = 0
      if (e) {
        const target = e.target as HTMLSpanElement
        const clientX = e.clientX
        if (!target.className) { // click on letters rather than spaces
          const parentElement = target.parentElement as HTMLSpanElement
          if (parentElement.childElementCount > 0) {
            let x = (parentElement.childNodes[0] as HTMLSpanElement).getBoundingClientRect().left
            for (let i = 0; i < parentElement.childNodes.length; i++) {
              const width = (parentElement.childNodes[i] as HTMLSpanElement).getBoundingClientRect().width
              x += width
              position++
              if (x >= clientX - width / 2) {
                break
              }
            }
          }
        }
      } else {
        position = this.items[index].content.length
      }
      this.editingIndex = index
      nextTick(() => {
        const editingItemElement = document.getElementById('editingItem') as HTMLInputElement
        if (editingItemElement) {
          editingItemElement.focus()
          editingItemElement.setSelectionRange(position, position)
        }
      })
    },
    doneEditing() {
      if (this.editingIndex !== null && !this.items[this.editingIndex].content) {
        this.items.splice(this.editingIndex, 1)
        this.save()
      }
      this.editingIndex = null
    },
    report() {
      const milliseconds = this.reportDays * 24 * 60 * 60 * 1000
      const items = this.items.filter(item => Date.now() - item.date! < milliseconds)
        .sort((item1, item2) => item1.date! - item2.date!)
      this.result = this.reportStatus(items, 'done') + '\n\n' + this.reportStatus(items, 'closed')
    },
    clearResult() {
      this.result = ''
    },
    clearItems() {
      this.items = this.items.filter(item => !item.date || Date.now() - item.date < this.clearItemTimespan)
      this.save()
    },
    exportItems() {
      this.result = JSON5.stringify(this.items, null, '  ')
    },
    importItems() {
      this.items = JSON5.parse(this.result)
      this.save()
    },
    clickResult() {
      this.canImport = true
      nextTick(() => {
        const resultElement = this.$refs.result as HTMLElement
        if (resultElement) {
          resultElement.focus()
        }
      })
    },
    doneEditingResult() {
      this.canImport = false
    },
    save() {
      localStorage.setItem(itemsKeyName, JSON.stringify(this.items))
    },
    reportStatus(items: Item[], status: Status) {
      return status + ':\n' + items.filter(item => item.status === status)
        .map(item => {
          const date = new Date(item.date!)
          const year = date.getFullYear().toString()
          const month = date.getMonth() + 1
          const monthString = month > 9 ? month.toString() : '0' + month
          const day = date.getDate()
          const dayString = day > 9 ? day.toString() : '0' + day
          const week = date.toLocaleDateString(navigator.language, { weekday: 'short' })
          return this.reportFormat.replace('[year]', year)
            .replace('[month]', monthString)
            .replace('[day]', dayString)
            .replace('[week]', week)
            .replace('[content]', item.content)
        })
        .join('\n')
    },
  }
})

function start() {
  const app = createApp(App)
  app.component('relative-time', RelativeTime)
  app.mount('#container')
}

type Status = 'open' | 'doing' | 'done' | 'closed'

interface Item {
  status: Status
  content: string
  date?: number
}

if (navigator.serviceWorker && !location.host.startsWith('localhost')) {
  navigator.serviceWorker.register('service-worker.bundle.js').catch((error: Error) => {
    console.log('registration failed with error: ' + error)
  })
}

import { locale as zhCNLocale } from 'relative-time-component/dist/locales/zh-CN'
if (navigator.language === 'zh-CN') {
  locale = zhCNLocale
}
start()
