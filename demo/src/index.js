import 'core-js'
import { InitGAPI } from './gapi.js'
import { InitAuth } from './auth.js'
import { Router } from './builtjs/services/router/index.js'

const Routes = {
    home: {
        path: `/`,
        content: `home-content`
    }
}

InitGAPI()
InitAuth()

export const router = Router(Routes)

console.log(router)

router.route$.subscribe(route => {
    console.log(`route`, route)
})