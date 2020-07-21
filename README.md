# Create MicroFrontEnd

Library that provides the ability to render a Create React App project within another React app.

## Setup

1. Install

`yarn add ` or `npm install` `create-react-microfrontend`

2. In the Create React App you want to be the micro frontend:

`import { createMicroFrontend } from 'create-react-microfrontend'`

3. Use it in root index.js

Example:

```
const reactRender = (renderProps, container) => {
    ReactDOM.render(
        <Router history={customHistory}>
            <App {...renderProps} />
        </Router>,
        container
    )
}

createMicroFrontend(
    reactRender,
    'POP',
    false, // noMFE
    props, // localProps
    'root' // containerId
)
```
