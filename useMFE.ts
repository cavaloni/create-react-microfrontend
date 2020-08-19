import { Render, Unmount } from './types'
type Manifest = { files: { [fileName: string]: string } }
type App = { render: Render, unmount: Unmount };

export const useMicrofrontendReact = (id: string, url: string) => {
    const { useEffect, useState } = require('react')
    const scriptId: string = `${id}Bundle`
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
        let promises: Promise<void>[]

        fetch(`${url}/asset-manifest.json`)
            .then((res) => res.json())
            .then((manifest: Manifest) => {
                promises = Object.keys(manifest['files'])
                    .filter((key) => key.endsWith('.js'))
                    .map((key) => {
                        return new Promise((resolve) => {
                            const path: string = `${url}${manifest['files'][key]}`
                            const script: HTMLScriptElement = document.createElement('script')
                            if (key === 'main.js') {
                                script.id = scriptId
                            }
                            script.onload = () => {
                                resolve()
                            }
                            script.src = path
                            document.head.appendChild(script)
                        })
                    })
                Promise.all(promises).then(() => {
                    setLoaded(true)
                })
            })
    }, [])

    const app: App = window[`${id}MicroFrontend`]

    return [isLoaded, app]
}

export default useMicrofrontendReact
