let lastCaptureEvent: Event

const captureEvent = ['click', 'mousedown', 'keyup', 'scroll', 'mouseover', 'mousewheel']

captureEvent.forEach((eventType) => {
    document.addEventListener(
        eventType,
        (event) => {
            lastCaptureEvent = event
        },
        {
            capture: true,
            passive: true,
        }
    )
})

export const getLastCaptureEvent = () => {
    return lastCaptureEvent
}
