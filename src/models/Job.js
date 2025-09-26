class Job {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.company = data.company || '';
    this.location = data.location || '';
    this.salary = data.salary || '';
    this.description = data.description || '';
    this.requirements = data.requirements || [];
    this.applyLink = data.applyLink || '';
    this.scrapedDate = data.scrapedDate || new Date().toISOString();
  }

  static fromScrapedData(data) {
    return new Job(data);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      company: this.company,
      location: this.location,
      salary: this.salary,
      description: this.description,
      requirements: this.requirements,
      applyLink: this.applyLink,
      scrapedDate: this.scrapedDate
    };
  }
}

module.exports = Job;