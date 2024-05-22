
let activeEffect

class Deps {
    subscribers = new Set()
    depend() {
        if (activeEffect) {
        this.subscribers.add(activeEffect)
        }
    }
    notify() {
        this.subscribers.forEach(sub => sub())
    }
}

const targetMap = new WeakMap()

function getDeps(target, key) {
    let depsMap = targetMap.get(target)
        if (!depsMap) {
            depsMap = new Map()
            targetMap.set(target, depsMap)
        }
        let dep = depsMap.get(key)
        if (!dep) {
            dep = new Deps()
            depsMap.set(key, dep)
        }
        return dep
    }

const reactiveHandlers = {
    get(target, key, receiver) {
        const dep = getDeps(target, key)
        dep.depend()
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        const dep = getDeps(target, key)
        const result = Reflect.set(target, key, value, receiver)
        dep.notify()
        return result
    }
    // more handlers
}
export function reactive(raw) {
    // proxy
    return new Proxy(raw, reactiveHandlers)
}

export function ref(raw) {
    return reactive({ value: raw })
}

export function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}
