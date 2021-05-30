import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Clipboard from 'clipboard'
import JSON5 from 'json5'
import { Locale, RelativeTime } from 'relative-time-react-component'
import produce from 'immer'

new Clipboard('.clipboard')

const itemsKeyName = 'todo.items'
const reportFormatKeyName = 'todo.report.format'
const initialItems = localStorage.getItem(itemsKeyName)
let locale: Locale | null = null
const clearItemTimespan = 7 * 24 * 60 * 60 * 1000

function App() {
  const [items, setItems] = React.useState((initialItems ? JSON.parse(initialItems) : []) as Item[])
  const [newItemContent, setNewItemContent] = React.useState('')
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [result, setResult] = React.useState('')
  const [canImport, setCanImport] = React.useState(false)
  const [reportFormatIsEditing, setReportFormatIsEditing] = React.useState(false)
  const [reportDays, setReportDays] = React.useState(0.5)
  const [reportDaysIsEditing, setReportDaysIsEditing] = React.useState(false)
  const [hoveringIndex, setHoveringIndex] = React.useState<number | null>(null)
  const [internalReportFormat, setInternalReportFormat] = React.useState(localStorage.getItem(reportFormatKeyName) || '[year]-[month]-[day]([week]): [content]')

  const canClearItems = items.length > 0 && items.some(item => !!item.date && Date.now() - item.date >= clearItemTimespan)
  const resultRef = React.createRef<HTMLTextAreaElement>()

  const getSpanedContent = (item: Item) => {
    return item.content.split('').map(c => `<span>${c}</span>`).join('')
  }
  const toggleReportFormatVisibility = () => {
    setReportFormatIsEditing(!reportFormatIsEditing)
    if (reportFormatIsEditing) {
      setTimeout(() => {
        const reportFormatElement = document.getElementById('reportFormat')
        if (reportFormatElement) {
          reportFormatElement.focus()
        }
      })
    }
  }
  const toggleReportDaysVisibility = () => {
    setReportDaysIsEditing(!reportDaysIsEditing)
    if (reportDaysIsEditing) {
      setTimeout(() => {
        const reportDaysElement = document.getElementById('reportDays')
        if (reportDaysElement) {
          reportDaysElement.focus()
        }
      })
    }
  }
  const create = () => {
    if (newItemContent && newItemContent.trim()) {
      items.unshift({
        status: 'open',
        content: newItemContent.trim()
      })
      save()
      setNewItemContent('')
    }
  }
  const canClose = (index: number) => {
    return hoveringIndex === index
      && editingIndex === null
      && (items[index].status === 'open' || items[index].status === 'doing')
  }
  const close = (index: number) => {
    setItems(produce(items, (draft) => {
      draft[index].status = 'closed'
      draft[index].date = Date.now()
    }))
    save()
  }
  const canOnIt = (index: number) => {
    return hoveringIndex === index
      && editingIndex === null
      && items[index].status === 'open'
  }
  const onIt = (index: number) => {
    setItems(produce(items, (draft) => {
      draft[index].status = 'doing'
    }))
    save()
  }
  const canDone = (index: number) => {
    return canClose(index)
  }
  const done = (index: number) => {
    setItems(produce(items, (draft) => {
      draft[index].status = 'done'
      draft[index].date = Date.now()
    }))
    save()
  }
  const canReopen = (index: number) => {
    return hoveringIndex === index
      && editingIndex === null
      && (items[index].status === 'done' || items[index].status === 'closed')
  }
  const reopen = (index: number) => {
    setItems(produce(items, (draft) => {
      draft[index].status = 'open'
    }))
    save()
  }
  const edit = (index: number, e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
      position = items[index].content.length
    }
    setEditingIndex(index)
    setTimeout(() => {
      const editingItemElement = document.getElementById('editingItem') as HTMLInputElement
      if (editingItemElement) {
        editingItemElement.focus()
        editingItemElement.setSelectionRange(position, position)
      }
    })
  }
  const doneEditing = () => {
    if (editingIndex !== null && !items[editingIndex].content) {
      items.splice(editingIndex, 1)
      save()
    }
    setEditingIndex(null)
  }
  const report = () => {
    const milliseconds = reportDays * 24 * 60 * 60 * 1000
    const validItems = items.filter(item => Date.now() - item.date! < milliseconds)
      .sort((item1, item2) => item1.date! - item2.date!)
    setResult(reportStatus(validItems, 'done') + '\n\n' + reportStatus(validItems, 'closed'))
  }
  const clearResult = () => {
    setResult('')
  }
  const clearItems = () => {
    setItems(items.filter(item => !item.date || Date.now() - item.date < clearItemTimespan))
    save()
  }
  const exportItems = () => {
    setResult(JSON5.stringify(items, null, '  '))
  }
  const importItems = () => {
    setItems(JSON5.parse(result))
    save()
  }
  const clickResult = () => {
    setCanImport(true)
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.focus()
      }
    })
  }
  const doneEditingResult = () => {
    setCanImport(false)
  }
  const save = () => {
    localStorage.setItem(itemsKeyName, JSON.stringify(items))
  }
  const reportStatus = (items: Item[], status: Status) => {
    return status + ':\n' + items.filter(item => item.status === status)
      .map(item => {
        const date = new Date(item.date!)
        const year = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const monthString = month > 9 ? month.toString() : '0' + month
        const day = date.getDate()
        const dayString = day > 9 ? day.toString() : '0' + day
        const week = date.toLocaleDateString(navigator.language, { weekday: 'short' })
        return internalReportFormat.replace('[year]', year)
          .replace('[month]', monthString)
          .replace('[day]', dayString)
          .replace('[week]', week)
          .replace('[content]', item.content)
      })
      .join('\n')
  }
  return (
    <div className="items">
      <div className="operations">
        {items.length > 0 && <button onClick={report}>report</button>}
        {canClearItems && <button onClick={clearItems}>clear items</button>}
        {items.length > 0 && <button onClick={exportItems}>export items</button>}
        {items.length > 0 && result && !canImport && <button onClick={importItems}>import items</button>}
        {result && !canImport && <button className="clipboard" data-clipboard-target="#report-result">copy</button>}
        {result && !canImport && <button onClick={clearResult}>clear</button>}
        {items.length > 0 && <button className={reportDaysIsEditing ? 'expanded' : ''} onClick={toggleReportDaysVisibility}>report days</button>}
        {items.length > 0 && <button className={reportFormatIsEditing ? 'expanded' : ''} onClick={toggleReportFormatVisibility}>report format</button>}
      </div>
      {reportDaysIsEditing && <input id="reportDays" value={reportDays} onChange={(e) => setReportDays(+e.target.value)} type="number" />}
      {reportFormatIsEditing && <input
        id="reportFormat"
        value={internalReportFormat}
        onChange={(e) => {
          setInternalReportFormat(e.target.value)
          localStorage.setItem(reportFormatKeyName, e.target.value)
        }}
        type="text"
      />}
      {canImport ? <textarea
        value={result}
        onChange={(e) => setResult(e.target.value)}
        onBlur={doneEditingResult}
        rows={20}
        ref={resultRef}
      >
      </textarea> : <pre id="report-result" onClick={clickResult}>{result}</pre>}
      <ul>
        <li>
          <input
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                create()
              }
            }}
          />
        </li>
        {items.map((item, i) => (
          <li
            key={i}
            onMouseEnter={() => setHoveringIndex(i)}
            onMouseLeave={() => setHoveringIndex(null)}
          >
            {editingIndex === i ? <input
              value={editingIndex !== null ? items[editingIndex].content : ''}
              onChange={(e) => {
                if (editingIndex !== null) {
                  setItems(produce(items, (draft) => {
                    draft[editingIndex].content = e.target.value
                  }))
                  save()
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  doneEditing()
                }
              }}
              id="editingItem"
              onBlur={() => doneEditing()}
            /> : (
              <>
                {item.status === 'closed' || item.status === 'done' ? (
                  <del
                    onClick={(e) => edit(i, e)}
                    className="content"
                    dangerouslySetInnerHTML={{ __html: getSpanedContent(item) }}
                  >
                  </del>
                ) : (
                  <span
                    onClick={(e) => edit(i, e)}
                    className="content"
                    dangerouslySetInnerHTML={{ __html: getSpanedContent(item) }}
                  >
                  </span>
                )}
              </>
            )}

            {editingIndex !== i && <span onClick={() => edit(i)} className={item.status}>
              {item.status}
              {item.date && <RelativeTime time={item.date} locale={locale} />}
            </span>}
            {canOnIt(i) && <button className="on-it" onClick={() => onIt(i)}>on it</button>}
            {canDone(i) && <button className="done" onClick={() => done(i)}>done</button>}
            {canClose(i) && <button className="close" onClick={() => close(i)}>close</button>}
            {canReopen(i) && <button className="reopen" onClick={() => reopen(i)}>reopen</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function start() {
  ReactDOM.render(<App />, document.getElementById('container'))
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
