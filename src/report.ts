import { config } from './config'
import { browserInfo } from './utils/getBrowserInfo'
import { v4 as uuidv4 } from 'uuid'

export interface IErrorData {
    message: string
    type: 'jsError' | 'resourceError'
    filePath?: string
    lineNumber?: number
    columnNumber?: number
    functionName?: string
    stack?: string
    selector?: string
    paths?: string
}

interface IErrorDataWithTime extends IErrorData {
    appId: string // 应用ID
    errorId: string // 错误ID
    timeStamp: string // 发生时间
    pageUrl: string // 页面URL
}

export const saveErrorToLocal = (error: IErrorData) => {
    const LocalStorageKey = config.appId + '-track-js-Lite-error'
    const errorList = JSON.parse(localStorage.getItem(LocalStorageKey) || '[]') as IErrorDataWithTime[]
    const errorWithTime: IErrorDataWithTime = {
        ...error,
        ...browserInfo,
        appId: config.appId!, // 应用ID
        errorId: uuidv4(),
        timeStamp: new Date().toISOString(), // 发生时间
        pageUrl: window.location.href, // 页面URL
    }
    errorList.push(errorWithTime)
    localStorage.setItem(LocalStorageKey, JSON.stringify(errorList))
}

/**
 * 上报错误
 *
 * 采用定时器延迟上报错误，避免频繁请求
 *
 * 采用Navigator.sendBeacon()向后端发送统计数据
 *
 * @param error
 */
export const reportError = (error: IErrorData) => {}
