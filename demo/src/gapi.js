import { ID } from './builtjs/services/id'

let documentData = {}
const fileId = `1JGrY0_fSmtZB1cCAb074hlDSPUJBL4HiD8CRBQky90Q`
const client = {
    apiKey: '',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    clientId: '679670526531-po28kjn9kdk5h93k8uf6n2i26harqedr.apps.googleusercontent.com',
    scope: 'profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send'
}

const signedInStatus = {
    is: false,
    on: new Date().getTime(),
    writer: false
}

const subscribers = {
    auth: {},
    document: {}
}

function updateSigninStatus(signedIn) {
    signedInStatus.is = signedIn
    signedInStatus.on = new Date().getTime()

    if (signedIn) {
        // if (this.showLogin) {
        //     window.location.pathname = `/`
        // }

        // this.user = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId()

        return gapi.client.drive.permissions.list({ fileId })
            .then(() => {
                trigger(`auth`, signedInStatus)
            })
            .catch(() => {
                trigger(`auth`, signedInStatus)
            })
    } else {
        trigger(`auth`, signedInStatus)
    }
}

function trigger(key, data) {
    if (subscribers[key]) {
        Object.keys(subscribers[key]).forEach(k => subscribers[key][k] && typeof subscribers[key][k] === `function` ? subscribers[key][k](data) : undefined)
    }

    return data
}

export function isSignedIn() {
    return signedInStatus
}

export function subscribeAuth(cb) {
    const id = ID()
    subscribers.auth[id] = cb

    return () => {
        subscribers.auth[id] = null
        delete subscribers.auth[id]
    }
}

export function getDoc() {
    return new Promise((resolve, reject) => {
        return gapi.client.drive.files.export({
            fileId,
            mimeType: `text/plain`
        })
            .then(response => {
                try {
                    documentData = JSON.parse(response.body.trim())
                    return resolve(trigger(`document`, documentData))
                } catch (error) {
                    reject({
                        error,
                        response
                    })
                }
            })
            .catch(reject)
    })
}

export function InitGAPI() {
    return new Promise((resolve, reject) => {
        const start = () => {
            gapi.client.init(client).then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())

                return getDoc()
                    .then(() => resolve(trigger(`document`, documentData)))
                    .catch(reject)
            })
        }

        gapi.load('client', start)
    })
}