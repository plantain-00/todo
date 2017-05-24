import * as Vue from "vue";
import Component from "vue-class-component";
import * as Clipboard from "clipboard";
import { indexTemplateHtml } from "./variables";

/*tslint:disable no-unused-expression */
new Clipboard(".clipboard");
/*tslint:enable no-unused-expression */

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
    reportResult = "";

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
            status: "created",
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
    canCancel(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "created" || this.items[index].status === "doing");
    }
    cancel(item: Item) {
        item.status = "canceled";
        item.date = Date.now();
        this.save();
    }
    canOnIt(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && this.items[index].status === "created";
    }
    onIt(item: Item) {
        item.status = "doing";
        this.save();
    }
    canFinish(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "created" || this.items[index].status === "doing");
    }
    finish(item: Item) {
        item.status = "finished";
        item.date = Date.now();
        this.save();
    }
    canReopen(index: number) {
        return this.hoveringIndex === index
            && this.editingIndex === null
            && (this.items[index].status === "finished" || this.items[index].status === "canceled");
    }
    reopen(item: Item) {
        item.status = "created";
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
        this.reportResult = this.reportStatus(items, "finished") + "\n\n" + this.reportStatus(items, "canceled");
    }
    reportLastDay() {
        this.report(24 * 60 * 60 * 1000);
    }
    reportLastWeek() {
        this.report(7 * 24 * 60 * 60 * 1000);
    }
    clearReport() {
        this.reportResult = "";
    }
}

/*tslint:disable:no-unused-expression*/
new App({ el: "#container" });
/*tslint:enable:no-unused-expression*/

type Status = "created" | "doing" | "finished" | "canceled";

interface Item {
    status: Status;
    content: string;
    date?: number;
}

declare class ServiceWorkerRegistration {
    installing: boolean;
    waiting: boolean;
    active: boolean;
}

declare class ServiceWorker {
    register(scriptUrl: string, options?: { scope?: string }): Promise<ServiceWorkerRegistration>;
}

declare const navigator: {
    serviceWorker: ServiceWorker;
};

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.bundle.js").catch(error => {
        console.log("registration failed with error: " + error);
    });
}
