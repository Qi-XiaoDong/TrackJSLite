export interface ITractJsLiteOption {
    appId: string
    reportUrl: string
    //是否全埋点
    trackerAll?: boolean
    ua?: boolean
    vue?: {
        Vue: any
        router: any
    }
}

export const config: Partial<ITractJsLiteOption> = {
    //是否全埋点
    trackerAll: true,
    vue: {
        Vue: null,
        router: null,
    },
    ua: true,
}

export const setOption = (options: ITractJsLiteOption) => {
    Object.keys(options).forEach((key) => {
        ;(config[key as keyof ITractJsLiteOption] as any) = options[key as keyof ITractJsLiteOption]
    })
}
