const http = require('http');

let request;
async function healthCheck(host) {
  try {
    const endpoint = `${host}:5000/health`;
    const result = await new Promise((resolve, reject) => {
      request = http.get({
        hostname: host,
        port: 5000,
        path: '/health',
        method: 'GET',
        timeout: 2000,
      }, (res) => {
        res.on('data',  (data) => {
          resolve(true);
        });
        res.on('error', (error) => {
          resolve(false);
        });
      });
      request.on('timeout', () => {
        resolve(false);
        // request.abort();
      });
      request.on('error', (error) => {
        resolve(false);
      });
    });

    if (request) {
      request.abort();
    }
    return result;
  } catch (err) {
    if (request) {
      request.abort();
    }
    return false;
  }
}

async function traverseInstances(instances) {
  for (let i=0; i< instances.length; i++) {
    const instance = instances[i];
    const { host } = instance;

    if (host) {
      const healthCheckSucceeds = await healthCheck(host);
      console.log({ healthCheckSucceeds })
      instances[i].isConnected = healthCheckSucceeds;
    }
  }

  return instances;
}

module.exports = {
  traverseInstances,
};
