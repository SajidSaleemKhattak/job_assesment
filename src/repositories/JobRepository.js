const path = require('path');
const JsonStore = require('../utils/jsonStore');

const jobsFile = path.join(__dirname, '../../data/jobs/jobs.json');
const store = new JsonStore(jobsFile);

module.exports = {
  findAll: () => store.readAll(),
  findById: (id) => store.getById(id),
  create: (data) => store.create(data),
  update: (id, data) => store.update(id, data),
  remove: (id) => store.remove(id),
  replaceAll: (items) => store.replaceAll(items)
};
