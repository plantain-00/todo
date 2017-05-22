import * as Vue from "vue";
import Component from "vue-class-component";
import { indexTemplateHtml } from "./variables";

@Component({
    template: indexTemplateHtml,
})
class App extends Vue {
    items: Item[] = [];
    newItemContent = "";
    hoveringIndex: number | null = null;
    editingIndex: number | null = null;

    get editingItemContent() {
        return this.editingIndex !== null ? this.items[this.editingIndex].content : "";
    }
    set editingItemContent(content: string) {
        if (this.editingIndex !== null) {
            this.items[this.editingIndex].content = content;
        }
    }

    create() {
        this.items.push({
            status: "created",
            content: this.newItemContent,
            remark: "",
        });
        this.newItemContent = "";
    }
    mouseenter(index: number) {
        this.hoveringIndex = index;
    }
    mouseleave() {
        this.hoveringIndex = null;
    }
    canCancel(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "created" || this.items[index].status === "doing");
    }
    cancel(item: Item) {
        item.status = "canceled";
        item.date = Date.now();
    }
    canOnIt(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && this.items[index].status === "created";
    }
    onIt(item: Item) {
        item.status = "doing";
    }
    canFinish(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "created" || this.items[index].status === "doing");
    }
    finish(item: Item) {
        item.status = "finished";
        item.date = Date.now();
    }
    edit(index: number) {
        this.editingIndex = index;
        Vue.nextTick(() => {
            const editingItemElement = document.getElementById("editingItem");
            if (editingItemElement) {
                editingItemElement.focus();
            }
        });
    }
    doneEditing() {
        this.editingIndex = null;
    }
}

/*tslint:disable:no-unused-expression*/
new App({ el: "#container" });
/*tslint:enable:no-unused-expression*/

interface Item {
    status: "created" | "doing" | "finished" | "canceled";
    content: string;
    remark: string;
    date?: number;
}
