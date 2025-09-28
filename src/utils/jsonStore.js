const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');
const logger = require('./logger');

class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, '[]', 'utf8');
    }
  }

  async readAll() {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      logger.error(`Invalid JSON in ${this.filePath}: ${e.message}`);
      return [];
    }
  }

  async writeAll(items) {
    await this.ensureFile();
    const json = JSON.stringify(items, null, 2);
    await fs.writeFile(this.filePath, json, 'utf8');
    return items;
  }

  async replaceAll(items) {
    // Overwrite entire collection
    return this.writeAll(Array.isArray(items) ? items : []);
  }

  async getById(id) {
    const items = await this.readAll();
    return items.find(i => i.id === id) || null;
  }

  async create(item) {
    const items = await this.readAll();
    const newItem = { id: item.id || randomUUID(), ...item, id: item.id || randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    items.push(newItem);
    await this.writeAll(items);
    return newItem;
  }

  async update(id, updates) {
    const items = await this.readAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...updates, id, updatedAt: new Date().toISOString() };
    items[idx] = updated;
    await this.writeAll(items);
    return updated;
  }

  async remove(id) {
    const items = await this.readAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this.writeAll(items);
    return true;
  }
}

module.exports = JsonStore;
