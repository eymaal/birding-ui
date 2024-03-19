import { writable } from "svelte/store";

const Message = writable({
    content: "",
    type: "",
    action: "",
    path: ""
})

export default Message;