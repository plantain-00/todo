import * as Vue from "vue";
import Component from "vue-class-component";
import * as Clipboard from "clipboard";
import { indexTemplateHtml } from "./variables";

// tslint:disable-next-line:no-unused-expression
new Clipboard(".clipboard");

const keyName = "todo.items";
const initialItems = localStorage.getItem(keyName);

@Component({
    template: indexTemplateHtml,
})
class App extends Vue {
    items: Item[] = initialItems ? JSON.parse(initialItems) : [];
    newItemContent = "";
    hoveringIndex: number | null = null;
    editingIndex: number | null = null;
    result = "";
    canImport = false;

    get editingItemContent() {
        return this.editingIndex !== null ? this.items[this.editingIndex].content : "";
    }
    set editingItemContent(content: string) {
        if (this.editingIndex !== null) {
            this.items[this.editingIndex].content = content;
            this.save();
        }
    }

    create() {
        this.items.push({
            status: "open",
            content: this.newItemContent,
        });
        this.save();
        this.newItemContent = "";
    }
    mouseenter(index: number) {
        this.hoveringIndex = index;
    }
    mouseleave() {
        this.hoveringIndex = null;
    }
    canClose(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "open" || this.items[index].status === "doing");
    }
    close(item: Item) {
        item.status = "closed";
        item.date = Date.now();
        this.save();
    }
    canOnIt(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && this.items[index].status === "open";
    }
    onIt(item: Item) {
        item.status = "doing";
        this.save();
    }
    canDone(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "open" || this.items[index].status === "doing");
    }
    done(item: Item) {
        item.status = "done";
        item.date = Date.now();
        this.save();
    }
    canReopen(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "done" || this.items[index].status === "closed");
    }
    reopen(item: Item) {
        item.status = "open";
        this.save();
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
    save() {
        localStorage.setItem(keyName, JSON.stringify(this.items));
    }
    reportStatus(items: Item[], status: Status) {
        return status + ":\n" + items.filter(item => item.status === status)
            .map(item => {
                const date = new Date(item.date!);
                const month = date.getMonth() + 1;
                return `${date.getFullYear()}-${month > 9 ? month : "0" + month}-${date.getDate()}(${date.getDay()}): ${item.content}`;
            })
            .join("\n");
    }
    report(milliseconds: number) {
        const items = this.items.filter(item => Date.now() - item.date! < milliseconds)
            .sort((item1, item2) => item1.date! - item2.date!);
        this.result = this.reportStatus(items, "done") + "\n\n" + this.reportStatus(items, "closed");
    }
    reportLastDay() {
        this.report(24 * 60 * 60 * 1000);
    }
    reportLastWeek() {
        this.report(7 * 24 * 60 * 60 * 1000);
    }
    clearResult() {
        this.result = "";
    }
    clearItems() {
        this.items = this.items.filter(item => !item.date || Date.now() - item.date < 7 * 24 * 60 * 60 * 1000);
        this.save();
    }
    exportItems() {
        this.result = JSON.stringify(this.items);
    }
    importItems() {
        this.items = JSON.parse(this.result);
        this.save();
    }
    clickResult() {
        this.canImport = true;
        Vue.nextTick(() => {
            const resultElement = this.$refs.result as HTMLElement;
            if (resultElement) {
                resultElement.focus();
            }
        });
    }
    doneEditingResult() {
        this.canImport = false;
    }
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });

type Status = "open" | "doing" | "done" | "closed";

interface Item {
    status: Status;
    content: string;
    date?: number;
}

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("service-worker.bundle.js").catch(error => {
        // tslint:disable-next-line:no-console
        console.log("registration failed with error: " + error);
    });
}
