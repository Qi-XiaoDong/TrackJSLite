import { config } from './config'
import { getLastCaptureEvent } from './utils/captureEvent'
import { parseErrorStack } from './utils/parseError'
import { getPaths } from './utils/parsePath'
import { getBrowserInfo } from './utils/getBrowserInfo'

/**
 * 错误捕获
 */
export const errorTrack = () => {
    //资源错误没有冒泡，所以只能在捕获阶段采集获取错误
    window.addEventListener('error', syncErrorTrack, true)

    //promise错误
    window.addEventListener('unhandledrejection', promiseErrorTrack)

    //vue错误
    if (config.vue?.Vue) {
        config.vue.Vue.config.errorHandler = vueErrorHandler
    }
}

// js错误以及资源错误
function syncErrorTrack(event: any) {
    const target = event.target
    //要判断是资源错误，还是js错误，很简单，直接判断事件对象有没有src或者href属性就可以了
    if (target && (target.src || target.href)) {
        sourceErrorHandler(target)
    } else {
        JsErrorHandler(event)
    }
}

// promise错误
function promiseErrorTrack(event: PromiseRejectionEvent) {
    const { functionName, columnNumber, filePath, lineNumber } = parseErrorStack(event.reason)[0] || {}
    const lastEvent = getLastCaptureEvent()
    const paths = getPaths(lastEvent)
    const errObj = {
        message: event.reason.message, // 错误信息
        type: 'promiseError-trackJsLite', // 错误类型
        filePath, // 错误文件
        lineNumber, // 错误行号
        columnNumber, // 错误列号
        functionName, // 函数名
        stack: event.reason?.stack?.toString(), // 错误堆栈
        selector: '', // css选择器，后期扩展
        timeStamp: new Date().toISOString(), // 发生时间
        paths, // 事件路径
    }
    console.log(errObj, 'promiseError--trackJsLite')
    // 上报promise错误 todo...
}

function vueErrorHandler(err: any, vm: any, info: any) {
    const { functionName, columnNumber, filePath, lineNumber } = parseErrorStack(err)[0] || {}
    const lastEvent = getLastCaptureEvent()
    const paths = getPaths(lastEvent)
    const errObj = {
        message: err.message, // 错误信息
        type: 'vueError-trackJsLite', // 错误类型
        filePath, // 错误文件
        lineNumber, // 错误行号
        columnNumber, // 错误列号
        functionName, // 函数名
        stack: err?.stack?.toString(), // 错误堆栈
        selector: '', // css选择器，后期扩展
        paths, // 事件路径
    }
    console.log(composeErrorInfo(errObj), 'vueError-trackJsLite')
    //上报vue错误 todo...
}
function JsErrorHandler(event: ErrorEvent) {
    const { functionName, columnNumber, filePath, lineNumber } = parseErrorStack(event.error)[0] || {}
    const lastEvent = getLastCaptureEvent()
    const paths = getPaths(lastEvent)
    const errObj = {
        message: event.message, // 错误信息
        type: 'jsError-trackJsLite', // 错误类型
        filePath, // 错误文件
        lineNumber, // 错误行号
        columnNumber, // 错误列号
        functionName, // 函数名
        stack: event.error?.stack?.toString(), // 错误堆栈
        selector: '', // css选择器，后期扩展
        paths, // 事件路径
    }
    console.log(composeErrorInfo(errObj), 'jsError--trackJsLite')
    //上报js错误 todo...
}

function sourceErrorHandler(target: any) {
    const data = {
        errorType: 'resourceError',
        filename: target.src || target.href,
        tagName: target.tagName,
        message: `加载${target.tagName}失败`,
    }
    console.log(composeErrorInfo(data), '资源错误--trackJsLite')

    // 上报资源错误 todo...
}

/**
 * 组合错误信息
 * @param error 错误对象
 */
function composeErrorInfo(error: Record<string, string | number | undefined>): Record<string, string | number | undefined> {
    const browserInfo = config.ua ? getBrowserInfo() : {}
    return {
        ...error,
        ...browserInfo,
        appId: config.appId, // 应用ID
        reportUrl: config.reportUrl, // 上报地址
        timeStamp: new Date().toISOString(), // 发生时间
    }
}
