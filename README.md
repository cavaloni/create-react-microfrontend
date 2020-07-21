# Create MicroFrontEnd

Library that provides the ability to render a Create React App project within another React app.

## Setup

1. Install

`yarn add ` or `npm install` `create-react-microfrontend`

2. In the Create React App you want to be the micro frontend:

`import { createMicroFrontend } from 'create-react-microfrontend'`

3. Use it in root index.js in the MFE (MicroFrontEnd)

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
    'POP', // App name
    false, // noMFE
    props, // localProps
    'root' // containerId
)
```
The `reactRender` function needs to be created to allow applying props from the parent app, and which component to apply them to.
If, for instance, you had some further HOCs which wrapped around `<App />`. It also allows for the flexibility of applying props locally, for development pruposes.

To develop locally, in the third argument, pass `true` (the noMFE option), and it will render the app to the `containerId` provided, and will apply the supplied `localProps` to the `reactRender` function. This noMFE option would be a good place to use `process.env.NODE_ENV === 'development'`. 

The `appName` will need to match the `appName` in the next step to retrieve the matching MFE.

4. useMicroFrontendReact in the parent application

Example :

```
import { useMicrofrontendReact } from 'create-react-microfrontend';

const [isLoaded, POP] = useMicrofrontendReact('POP', 'http://localhost:3000');

 React.useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const { render, unmount } = POP;

    render(id, POPProps);
    return () => unmount(id);
  },              [isLoaded]);

```

`useMicrofrontendReact(appName, microFrontendURL)` returns `isLoaded` and the application functions of `render(id, props)` and `unmount(id)`. Once the application is fetched, `isLoaded` returns true and the app can be rendered, and then unmount can be used in the cleanup as a returned function to a `useEffect`.




