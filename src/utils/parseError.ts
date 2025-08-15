const maxStackLines = 5

interface ITransFormErrorStackLine {
    functionName: string
    filePath: string
    lineNumber?: number | undefined
    columnNumber?: number | undefined
}
/**
 * 这个正则表达式用于匹配 JavaScript 错误栈中的堆栈跟踪信息中的单个条目，其中包含文件名、行号和列号等信息。
 * 具体来说，它匹配以下格式的文本：
 * at functionName (filename:lineNumber:columnNumber)
 * at filename:lineNumber:columnNumber
 * at http://example.com/filename:lineNumber:columnNumber
 * at https://example.com/filename:lineNumber:columnNumber
 */
const FULL_MATCH =
    /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i

/**
 *
 * @param errorLine JavaScript 错误栈中的单个条目
 * @description 解析错误栈中的单个条目，提取函数名、文件路径、行号和列号等信息。
 * @example
 * transformErrorStackLine("    at myFunction (http://example.com/script.js:10:15)")
 *  返回 { functionName: "myFunction", filePath: "http://example.com/script.js", lineNumber: 10, columnNumber: 15 }
 * @example
 * transformErrorStackLine("    at http://example.com/script.js:10:15")
 * 返回 { functionName: "<anonymous>", filePath: "http://example.com/script.js", lineNumber: 10, columnNumber: 15 }
 * @example
 * transformErrorStackLine("    at script.js:10:15")
 *  返回 { functionName: "<anonymous>", filePath: "script.js", line
 * @returns
 */
const transformErrorStackLine = (errorLine: Error['stack']): ITransFormErrorStackLine | {} => {
    const lineMatch = errorLine!.match(FULL_MATCH)
    if (!lineMatch) return {}
    const [, functionName, filePath, lineNumber, columnNumber] = lineMatch
    return {
        functionName: functionName || '<anonymous>',
        filePath: filePath || '<unknown>',
        lineNumber: lineNumber ? parseInt(lineNumber, 10) : undefined,
        columnNumber: columnNumber ? parseInt(columnNumber, 10) : undefined,
    }
}

/**
 *
 * @param error JavaScript 错误对象
 * @description 解析 JavaScript 错误对象的堆栈信息，提取每一行的函数名、文件路径、行号和列号等信息。
 * @returns
 */
export const parseErrorStack = (error: Error): ITransFormErrorStackLine[] => {
    const stack = error.stack
    if (!stack) return []
    const stackLines = stack.split('\n')
    return stackLines
        .slice(1)
        .map((line) => transformErrorStackLine(line))
        .slice(0, maxStackLines) as ITransFormErrorStackLine[]
}
