const express = require('express');
const fs = require('fs');

const utility = require('./utility');

const app = express();

app.use(express.json());

app.get('/instances', async (req, res) => {
  let instances = JSON.parse(fs.readFileSync('./instances.json').toString());
  instances = await utility.traverseInstances(instances);

  let instanceComponent;

  for (let i=0; i<instances.length; i++) {
    if (!instances[i].isConnected) {
      instanceComponent = instances[i].component;
    }
  }

  res.status(200).send(instanceComponent);
});

app.post('/instance', async (req, res) => {
  const { publicIp, component } = req.body;
  let instances = JSON.parse(fs.readFileSync('./instances.json').toString());
  instances = await utility.traverseInstances(instances);

  for (let i=0; i< instances.length; i++) {
    if (instances[i].component === component) {
      instances[i].component = component;
      instances[i].host = publicIp;
      instances[i].isConnected = true;
      break;
    }
  }

  fs.writeFileSync('./instances.json', JSON.stringify(instances));
  res.status(200).send(instances);
});

app.listen(5001, () => {
  console.log(`Server running at port 5001`);
});
