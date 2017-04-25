import { tracked } from '@glimmer/component';
import BaseComponent from '../base-component';
import { Employee, Position, Department } from '../models';

export default class EmployeeForm extends BaseComponent {
  @tracked employee: Employee;
  @tracked departments: Array<Department>;

  addPosition() {
    let historicalIndex = this.employee.positions.length + 1;
    this.employee.positions.push(new Position({ historicalIndex }));
    this.employee = this.employee;
  }

  fetchDepartments() {
    Department.select({ departments: ['name'] }).all().then((response) => {
      this.departments = response.data;
    });
  }

  changeDepartment(position, e) {
    let department = this.departments.find((d) => {
      return d.id === e.target.value
    });
    position.department = department;
    this.employee = this.employee;
  }

  constructor(options) {
    super(options);
    this.fetchDepartments();
    this.reset();
  }

  submit(e?) {
    if (e) e.preventDefault();

    this.employee.save({ with: { positions: 'department' }}).then((success) => {
      this.employee = this.employee;
      if (success) this.reset();
    });
  }

  reset() {
    let position = new Position({ historicalIndex: 1 });
    this.employee = new Employee({ positions: [position] });
  }
};
