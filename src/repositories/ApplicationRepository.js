const path = require('path');
const JsonStore = require('../utils/jsonStore');

const applicationsFile = path.join(__dirname, '../../data/applications/applications.json');
const store = new JsonStore(applicationsFile);

module.exports = {
  findAll: () => store.readAll(),
  findById: (id) => store.getById(id),
  create: (data) => store.create(data),
  update: (id, data) => store.update(id, data),
  remove: (id) => store.remove(id),
  replaceAll: (items) => store.replaceAll(items)
};
