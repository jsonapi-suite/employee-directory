import { tracked } from '@glimmer/component';
import BaseComponent from '../base-component';
import { Employee, Position, Department } from '../models';

export default class EmployeeSearch extends BaseComponent {
  @tracked employees;

  constructor(options) {
    super(options);
    this.search();
  }

  search(e?) {
    if (e) e.preventDefault();

    let scope = Employee
      .includes({ current_position: 'department' })
      .per(5);

    scope.all().then((response) => {
      this.employees = response.data;
    });
  }
};
