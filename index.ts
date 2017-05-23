import * as Vue from "vue";
import Component from "vue-class-component";
import { indexTemplateHtml } from "./variables";

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
            remark: "",
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
