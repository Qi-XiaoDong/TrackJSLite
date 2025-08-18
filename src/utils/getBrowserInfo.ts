export function getBrowserInfo() {
    const ua = navigator.userAgent

    // 操作系统判断
    let os = 'Unknown'
    if (/windows/i.test(ua)) os = 'Windows'
    else if (/macintosh|mac os x/i.test(ua)) os = 'MacOS'
    else if (/android/i.test(ua)) os = 'Android'
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
    else if (/linux/i.test(ua)) os = 'Linux'

    // 浏览器类型和版本
    let browser = 'Unknown'
    let version = ''
    if (/chrome\/([\d.]+)/i.test(ua)) {
        browser = 'Chrome'
        version = ua.match(/chrome\/([\d.]+)/i)?.[1] || ''
    } else if (/firefox\/([\d.]+)/i.test(ua)) {
        browser = 'Firefox'
        version = ua.match(/firefox\/([\d.]+)/i)?.[1] || ''
    } else if (/safari\/([\d.]+)/i.test(ua) && !/chrome/i.test(ua)) {
        browser = 'Safari'
        version = ua.match(/version\/([\d.]+)/i)?.[1] || ''
    } else if (/edg\/([\d.]+)/i.test(ua)) {
        browser = 'Edge'
        version = ua.match(/edg\/([\d.]+)/i)?.[1] || ''
    } else if (/msie\s([\d.]+)/i.test(ua) || /trident\/.+?rv:([\d.]+)/i.test(ua)) {
        browser = 'IE'
        version = ua.match(/msie\s([\d.]+)/i)?.[1] || ua.match(/trident\/.+?rv:([\d.]+)/i)?.[1] || ''
    }

    return { 'system-os': os, 'system-browser': browser, 'system-browser-version': version, ua }
}

export const browserInfo = getBrowserInfo()
