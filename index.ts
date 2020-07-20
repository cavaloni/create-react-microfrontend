export const createMicroFrontend = (
  renderFunc,
  appName,
  noMFE?,
  localProps?,
  localContainer?
  ) => {
    const  ReactDOM = require('react-dom');
    const createMFE = () => {
        const render = (containerId, data) => {
            const container = document.getElementById(containerId)
            if (!containerId) {
                throw new Error('An ID must provided')
            }
            renderFunc(data, container)
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

    if (noMFE) {
        renderFunc(
            localProps,
            document.getElementById(
                localContainer ? localContainer : 'root'
            )
        )
    } else {
        createMFE()
    }
}


export const useMicrofrontendReact = (id, url) => {
  const { useEffect, useState } = require('react');
  const scriptId = `${id}Bundle`;
  const [isLoaded, setLoaded] = useState(false);

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
          setLoaded(true);
        });
      });
  },        []);

  const app = window[`${id}MicroFrontend`];

  return [isLoaded, app as any];
};

export default {
  createMicroFrontend,
  useMicrofrontendReact
};
