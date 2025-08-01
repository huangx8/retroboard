const { v4: uuidv4 } = require('uuid');

class Board {
  constructor(name = null) {
    this.id = uuidv4();
    this.name = name || `Board ${this.id.slice(0, 8)}`;
    this.objects = []; // Canvas objects (shapes, text, images)
    this.background = '#ffffff';
    this.createdAt = new Date();
    this.lastModified = new Date();
  }

  addObject(object, user) {
    const objectWithId = {
      ...object,
      id: uuidv4(),
      createdBy: user.id,
      createdAt: new Date(),
      // Use user's profile color for shapes (but not for images/videos)
      fill: object.type === 'line' || object.type === 'image' || object.type === 'video'
        ? object.fill
        : (object.fill || user.color),
      stroke: object.type === 'image' || object.type === 'video'
        ? object.stroke
        : (object.stroke || user.color)
    };

    this.objects.push(objectWithId);
    this.updateLastModified();
    return objectWithId;
  }

  updateObject(objectId, updates, user) {
    const objectIndex = this.objects.findIndex(obj => obj.id === objectId);
    if (objectIndex !== -1) {
      this.objects[objectIndex] = {
        ...this.objects[objectIndex],
        ...updates,
        lastModifiedBy: user.id,
        lastModified: new Date()
      };
      this.updateLastModified();
      return this.objects[objectIndex];
    }
    return null;
  }

  deleteObject(objectId) {
    const objectIndex = this.objects.findIndex(obj => obj.id === objectId);
    if (objectIndex !== -1) {
      const deletedObject = this.objects.splice(objectIndex, 1)[0];
      this.updateLastModified();
      return deletedObject;
    }
    return null;
  }

  clearObjects() {
    this.objects = [];
    this.updateLastModified();
  }

  updateLastModified() {
    this.lastModified = new Date();
  }

  toSummary() {
    return {
      id: this.id,
      name: this.name,
      lastModified: this.lastModified,
      objectCount: this.objects.length,
      createdAt: this.createdAt
    };
  }
}

module.exports = Board;
