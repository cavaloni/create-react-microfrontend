import { Render, Unmount } from './types'
type Manifest = { files: { [fileName: string]: string } }
type App = { render: Render; unmount: Unmount }

export const useMicrofrontendReact = (id: string, url: string) => {
    const { useEffect, useState } = require('react')
    const scriptId: string = `${id}Bundle`
    const [isLoaded, setLoaded] = useState(false)
    let error

    useEffect(() => {
        let promises: Promise<void>[]
        fetch(`${url}/asset-manifest.json`)
            .then((res) => res.json())
            .then((manifest: Manifest) => {
                promises = Object.keys(manifest['files'])
                    .filter(
                        (key) => key.endsWith('.js') || key.endsWith('.css')
                    )
                    .filter((key) => {
                        // In a production build, the service worker.js does not load properly yet. Precache doesn't appear to required
                        if (process.env.NODE_ENV === 'production') {
                            return !key.includes('service-worker') && !key.includes('precache')
                        } else {
                            return true
                        }
                    })
                    .map((key) => {
                        return new Promise((resolve) => {
                            const path: string = `${manifest['files'][key]}`
                            if (key.endsWith('.css')) {
                                const link: HTMLLinkElement = document.createElement(
                                    'link'
                                )
                                link.rel = 'stylesheet'
                                link.href = path
                                document.head.appendChild(link)
                                resolve()
                            } else {
                                const script: HTMLScriptElement = document.createElement(
                                    'script'
                                )
                                if (key === 'main.js') {
                                    script.id = scriptId
                                }
                                script.onload = () => {
                                    resolve()
                                }
                                script.src = path
                                document.head.appendChild(script)
                            }
                        })
                    })
                Promise.all(promises)
                    .then(() => {
                        setLoaded(true)
                    })
                    .catch((err) => {
                        error = err
                    })
            })
    }, [])

    const app: App = window[`${id}MicroFrontend`]

    return [isLoaded, app, error]
}

export default useMicrofrontendReact
