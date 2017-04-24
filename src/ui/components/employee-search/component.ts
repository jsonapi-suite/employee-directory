import { tracked } from '@glimmer/component';
import BaseComponent from '../base-component';
import { Employee, Position, Department } from '../models';

class Query {
  @tracked firstNamePrefix;
  @tracked lastNamePrefix;
}

export default class EmployeeSearch extends BaseComponent {
  @tracked employees;
  @tracked query = new Query();

  constructor(options) {
    super(options);
    this.search();
  }

  search(e?) {
    if (e) e.preventDefault();

    let scope = Employee
      .includes({ current_position: 'department' })
      .per(5);

    if (this.query.firstNamePrefix) {
      scope = scope.where({
        first_name_prefix: this.query.firstNamePrefix
      });
    }
    if (this.query.lastNamePrefix) {
      scope = scope.where({
        last_name_prefix: this.query.lastNamePrefix
      });
    }

    scope.all().then((response) => {
      this.employees = response.data;
    });
  }
};
