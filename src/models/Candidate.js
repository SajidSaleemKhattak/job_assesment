class Candidate {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.skills = data.skills || [];
    this.experience = data.experience || [];
    this.education = data.education || [];
    this.resumePath = data.resumePath || '';
  }

  static fromParsedResume(data) {
    return new Candidate(data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      skills: this.skills,
      experience: this.experience,
      education: this.education,
      resumePath: this.resumePath
    };
  }
}

module.exports = Candidate;