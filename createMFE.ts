import { Render, Unmount } from './types';
type LocalProps = object
type Container = HTMLElement

export const createMicroFrontend = (
    renderFunc: (localProps: LocalProps, container: Container) => void,
    appName: string,
    noMFE?: boolean,
    localProps?: LocalProps,
    localContainer?: string
) => {
    const ReactDOM = require('react-dom')
    const createMFE: () => void = () => {
        const render: Render = (containerId, data) => {
            const container: Container = document.getElementById(containerId)
            if (!containerId) {
                throw new Error('An ID must provided')
            }
            renderFunc(data, container)
        }
        const unmount: Unmount = containerId => {
            const container: Container = document.getElementById(containerId)
            if (!container) {
                return
            }
            ReactDOM.unmountComponentAtNode(container)
        }

        window[`${appName}MicroFrontend`] = {
            render,
            unmount,
        }
    }

    if (noMFE) {
        renderFunc(
            localProps,
            document.getElementById(localContainer || 'root')
        )
    } else {
        createMFE()
    }
}

export default createMicroFrontend
