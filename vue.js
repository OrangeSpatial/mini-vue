import { reactive, watchEffect, ref } from './reactivity.js'
import { mount, h, patch } from './render.js'

function createApp(app, container) {
    let state = app.setup()
    let isMounted = false
    let prevTree

    watchEffect(() => {
        let newTree = app.render(state)
        // let newTree = app.render()
        if (isMounted) {
            patch(prevTree, newTree)
        } else {
            mount(newTree, container)
            isMounted = true
        }
        prevTree = newTree
    })
}

export default {
    reactive,
    ref,
    watchEffect,
    mount,
    h,
    patch,
    createApp
}