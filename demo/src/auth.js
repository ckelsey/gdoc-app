import { subscribeAuth } from "./gapi"

export const User = {
    id: null
}

export function InitAuth() {
    subscribeAuth(data => {
        console.log(`InitAuth data`, data)
    })
}