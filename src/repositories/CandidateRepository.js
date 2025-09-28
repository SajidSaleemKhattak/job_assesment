const path = require('path');
const JsonStore = require('../utils/jsonStore');

const candidatesFile = path.join(__dirname, '../../data/candidates/candidates.json');
const store = new JsonStore(candidatesFile);

module.exports = {
  findAll: () => store.readAll(),
  findById: (id) => store.getById(id),
  create: (data) => store.create(data),
  update: (id, data) => store.update(id, data),
  remove: (id) => store.remove(id),
  replaceAll: (items) => store.replaceAll(items)
};
