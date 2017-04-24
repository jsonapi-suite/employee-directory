import { Model, hasMany, hasOne, belongsTo, attrDecorator, attr, Config } from 'jsorm';
import { tracked } from '@glimmer/component';
let trackedAttr = attrDecorator(tracked);

class ApplicationRecord extends Model {
  static baseUrl = '/';
  static apiNamespace = 'api/v1';

  @tracked
  get isDestroyed() {
    return this.isMarkedForDestruction();
  }
}

export class Employee extends ApplicationRecord {
  static jsonapiType = 'employees';
  @tracked errors;

  @trackedAttr
  firstName = attr();
  @trackedAttr
  lastName = attr();
  @trackedAttr
  age = attr();

  @trackedAttr
  currentPosition = hasOne('positions');
  @trackedAttr
  positions = hasMany();

  @trackedAttr
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Position extends ApplicationRecord {
  static jsonapiType = 'positions';

  @trackedAttr
  title = attr();

  @trackedAttr
  department = belongsTo('departments');
}

export class Department extends ApplicationRecord {
  static jsonapiType = 'departments';

  @trackedAttr
  name = attr();
}

Config.setup();

export default { Employee };
