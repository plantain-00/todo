/**
 * This file is generated by 'file2variable-cli'
 * It is not mean to be edited by hand
 */
// tslint:disable
import { App } from "./index";

// @ts-ignore
export function indexTemplateHtml(this: App) {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"items"},[_c('div',{staticClass:"operations"},[(_vm.items.length > 0)?_c('button',{on:{"click":function($event){_vm.report()}}},[_vm._v("report")]):_vm._e(),(_vm.canClearItems)?_c('button',{on:{"click":function($event){_vm.clearItems()}}},[_vm._v("clear items")]):_vm._e(),(_vm.items.length > 0)?_c('button',{on:{"click":function($event){_vm.exportItems()}}},[_vm._v("export items")]):_vm._e(),(_vm.items.length > 0 && _vm.result && !_vm.canImport)?_c('button',{on:{"click":function($event){_vm.importItems()}}},[_vm._v("import items")]):_vm._e(),(_vm.result && !_vm.canImport)?_c('button',{staticClass:"clipboard",attrs:{"data-clipboard-target":"#report-result"}},[_vm._v("copy")]):_vm._e(),(_vm.result && !_vm.canImport)?_c('button',{on:{"click":function($event){_vm.clearResult()}}},[_vm._v("clear")]):_vm._e(),(_vm.items.length > 0)?_c('button',{class:_vm.reportDaysIsEditing ? 'expanded' : '',on:{"click":function($event){_vm.toggleReportDaysVisibility()}}},[_vm._v("report days")]):_vm._e(),(_vm.items.length > 0)?_c('button',{class:_vm.reportFormatIsEditing ? 'expanded' : '',on:{"click":function($event){_vm.toggleReportFormatVisibility()}}},[_vm._v("report format")]):_vm._e()]),(_vm.reportDaysIsEditing)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.reportDays),expression:"reportDays"}],attrs:{"id":"reportDays","type":"number"},domProps:{"value":(_vm.reportDays)},on:{"input":function($event){if($event.target.composing){ return; }_vm.reportDays=$event.target.value}}}):_vm._e(),_vm._v(" "),(_vm.reportFormatIsEditing)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.reportFormat),expression:"reportFormat"}],attrs:{"id":"reportFormat","type":"text"},domProps:{"value":(_vm.reportFormat)},on:{"input":function($event){if($event.target.composing){ return; }_vm.reportFormat=$event.target.value}}}):_vm._e(),(_vm.canImport)?_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.result),expression:"result"}],ref:"result",attrs:{"rows":"20"},domProps:{"value":(_vm.result)},on:{"focusout":function($event){_vm.doneEditingResult()},"input":function($event){if($event.target.composing){ return; }_vm.result=$event.target.value}}}):_c('pre',{attrs:{"id":"report-result"},on:{"click":function($event){_vm.clickResult()}}},[_vm._v(_vm._s(_vm.result))]),_c('ul',[_c('li',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.newItemContent),expression:"newItemContent"}],domProps:{"value":(_vm.newItemContent)},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.create()},"input":function($event){if($event.target.composing){ return; }_vm.newItemContent=$event.target.value}}})]),_vm._l((_vm.items),function(item,i){return _c('li',{key:i,on:{"mouseenter":function($event){_vm.mouseenter(i)},"mouseleave":function($event){_vm.mouseleave()}}},[(_vm.editingIndex === i)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.editingItemContent),expression:"editingItemContent"}],attrs:{"id":"editingItem"},domProps:{"value":(_vm.editingItemContent)},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.doneEditing()},"focusout":function($event){_vm.doneEditing()},"input":function($event){if($event.target.composing){ return; }_vm.editingItemContent=$event.target.value}}}):[(item.status === 'closed' || item.status === 'done')?_c('del',{staticClass:"content",domProps:{"innerHTML":_vm._s(_vm.getSpanedContent(item))},on:{"click":function($event){_vm.edit(i, $event)}}}):_c('span',{staticClass:"content",domProps:{"innerHTML":_vm._s(_vm.getSpanedContent(item))},on:{"click":function($event){_vm.edit(i, $event)}}})],(_vm.editingIndex !== i)?_c('span',{class:item.status,on:{"click":function($event){_vm.edit(i)}}},[_vm._v(_vm._s(item.status)),(item.date)?[_vm._v("("),_c('relative-time',{attrs:{"time":item.date,"locale":_vm.locale}}),_vm._v(")")]:_vm._e()],2):_vm._e(),(_vm.canOnIt(i))?_c('button',{staticClass:"on-it",on:{"click":function($event){_vm.onIt(item)}}},[_vm._v("on it")]):_vm._e(),(_vm.canDone(i))?_c('button',{staticClass:"done",on:{"click":function($event){_vm.done(item)}}},[_vm._v("done")]):_vm._e(),(_vm.canClose(i))?_c('button',{staticClass:"close",on:{"click":function($event){_vm.close(item)}}},[_vm._v("close")]):_vm._e(),(_vm.canReopen(i))?_c('button',{staticClass:"reopen",on:{"click":function($event){_vm.reopen(item)}}},[_vm._v("reopen")]):_vm._e()],2)})],2)])}
// tslint:enable
