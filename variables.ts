export const indexTemplateHtml = `<div><ul class="items"><li><input v-model="newItemContent" @keyup.enter="create()"><button v-if="newItemContent" @click="create()">create</button></li><li v-for="(item, i) in items" @mouseenter="mouseenter(i)" @mouseleave="mouseleave()"><input v-if="editingIndex === i" v-model="editingItemContent" @keyup.enter="doneEditing()" id="editingItem" @focusout="doneEditing()"><span v-else @click="edit(i)" :class="item.status"><del v-if="item.status === 'canceled'">{{item.content}}</del><template v-else>{{item.content}}</template></span><button v-if="editingIndex === i && editingItemContent" @click="doneEditing()">done</button><button v-if="canOnIt(i)" @click="onIt(item)">on it</button><button v-if="canFinish(i)" @click="finish(item)">finish</button><button v-if="canCancel(i)" @click="cancel(item)">cancel</button></li></ul></div>`;
