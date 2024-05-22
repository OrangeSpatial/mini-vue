export function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

export function mount(vnode, container) {
  const el = document.createElement(vnode.tag)
  vnode.el = el

  if (vnode.props) {
    for (const key in vnode.props) {
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
          continue
        }
        el.setAttribute(key, vnode.props[key])
      }
  }

  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children
  } else {
    vnode.children.forEach(child => {
      mount(child, el)
    })
  }

  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  container.appendChild(el)
}

export function patch(n1, n2) {
  if (n1.tag !== n2.tag) {
    const el = document.createElement(n2.tag)
    n2.el = el
    n1.el.replaceWith(el)
  } else {
    n2.el = n1.el
    // props
    const newProps = n2.props || {}
    const oldProps = n1.props || {}
    for (const key in newProps) {
      const oldValue = oldProps[key]
      const newValue = newProps[key]
      if (oldValue !== newValue) {
        n2.el.setAttribute(key, newValue)
      }
    }
    for (const key in oldProps) {
      if (!newProps[key]) {
        n2.el.removeAttribute(key)
      }
    }

    // children
    const newChildren = n2.children || []
    const oldChildren = n1.children || []
    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (newChildren !== oldChildren) {
          n2.el.textContent = newChildren
        }
      } else {
        n2.el.textContent = newChildren
      }
    } else {
      if (typeof oldChildren === 'string') {
        n2.el.innerHtml = ''
        newChildren.forEach(child => {
          mount(child, n2.el)
        })
      }
      const commonLength = Math.min(newChildren.length, oldChildren.length)
      for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i])
      }
      if (newChildren.length > oldChildren.length) {
        newChildren.slice(oldChildren.length).forEach(child => {
          mount(child, n2.el)
        })
      } else if (newChildren.length < oldChildren.length) {
        oldChildren.slice(newChildren.length).forEach(child => {
          child.el.remove()
        })
      }
    }
  }
}
