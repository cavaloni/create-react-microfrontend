import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export const createMicroFrontend = (
    renderFunc,
    appName,
    microLocal?,
    localProps?,
    localContainer?
) => {
    const createMFE = (props?) => {
        const render = (containerId, data) => {
            const container = document.getElementById(containerId)
            if (!containerId) {
                throw new Error('An ID must provided')
            }
            const propsToUse = Object.keys(props).length > 0 ? props : data
            renderFunc(propsToUse, container)
        }
        const unmount = containerId => {
            const container = document.getElementById(containerId)
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

    if (process.env.NODE_ENV === 'development') {
        if (microLocal) {
            createMFE(localProps)
        } else {
            renderFunc(
                localProps,
                document.getElementById(
                    localContainer ? localContainer : 'root'
                )
            )
        }
    } else {
        createMFE()
    }
}


export const useMicrofrontendReact = (id, url) => {
  const scriptId = `${id}Bundle`;
  const [isLoaded, setLoaded] = useState(!!window[id]);
  const [app, updateApp] = useState({});

  useEffect(() => {
    let promises;

    fetch(`${url}/asset-manifest.json`)
      .then(res => res.json())
      .then((manifest) => {
        promises = Object.keys(manifest['files'])
          .filter(key => key.endsWith('.js'))
          .map((key) => {
            return new Promise((resolve) => {
              const path = `${url}${manifest['files'][key]}`;
              const script = document.createElement('script');
              if (key === 'main.js') {
                script.id = scriptId;
              }
              script.onload = () => {
                resolve();
              };
              script.src = path;
              document.head.appendChild(script);
            });
          },
            );
        Promise.all(promises).then(() => {
          const app = window[`${id}MicroFrontend`];
          updateApp(app);
          setLoaded(true);
        });
      });
  },        []);

  return [isLoaded, app as any];
};

export default useMicrofrontendReact;
