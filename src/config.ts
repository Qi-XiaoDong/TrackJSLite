export interface ITractJsLiteOption {
    appId: string
    reportUrl: string
    //是否全埋点
    trackerAll?: boolean
    vue?: {
        Vue: any
        router: any
    }
    reportHandler?: (data: any) => void
}

interface ITractJsLiteConfig extends ITractJsLiteOption {
    ua: string
}

export const config: Partial<ITractJsLiteConfig> = {
    //是否全埋点
    trackerAll: true,
    vue: {
        Vue: null,
        router: null,
    },
    ua: navigator.userAgent,
}

export const setOption = (options: ITractJsLiteOption) => {
    Object.keys(options).forEach((key) => {
        ;(config[key as keyof ITractJsLiteOption] as any) = options[key as keyof ITractJsLiteOption]
    })
}
