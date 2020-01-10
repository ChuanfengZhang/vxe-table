import XEUtils from 'xe-utils'
import Interceptor from './src/interceptor'
import Renderer from './src/renderer'
import Setup from './src/setup'
import GlobalConfig from '../conf'
import { UtilTools } from '../tools'

const installedPlugins = []

function use (Plugin, options) {
  if (Plugin && Plugin.install) {
    if (installedPlugins.indexOf(Plugin) === -1) {
      Plugin.install(VXETable, options)
      installedPlugins.push(Plugin)
    }
  }
  return VXETable
}

/**
 * 创建数据仓库
 */
class VXEStore {
  constructor () {
    this.store = {}
  }
  mixin (map) {
    Object.assign(this.store, map)
    return VXEStore
  }
  get (type) {
    return this.store[type]
  }
  add (type, callback) {
    this.store[type] = callback
    return VXEStore
  }
  delete (type) {
    delete this.store[type]
    return VXEStore
  }
}

const commands = new VXEStore()
const menus = new VXEStore()

export const VXETable = {
  t: key => GlobalConfig.i18n(key),
  v: 'v1',
  use,
  types: {},
  setup: Setup,
  interceptor: Interceptor,
  renderer: Renderer,
  commands,
  menus
}

// v3.0 中废弃 buttons
Object.defineProperty(VXETable, 'buttons', {
  get () {
    UtilTools.warn('vxe.error.delProp', ['buttons', 'commands'])
    return commands
  }
})

/**
 * 获取下一个 zIndex
 */
Object.defineProperty(VXETable, 'nextZIndex', { get: UtilTools.nextZIndex })

/**
 * 获取所有导出类型
 */
Object.defineProperty(VXETable, 'exportTypes', {
  get () {
    return Object.keys(VXETable.types)
  }
})

/**
 * 获取所有导入类型
 */
Object.defineProperty(VXETable, 'importTypes', {
  get () {
    const rest = []
    XEUtils.each(VXETable.types, (flag, type) => {
      if (flag) {
        rest.push(type)
      }
    })
    return rest
  }
})

export default VXETable
