import { tracked } from '@glimmer/component';
import BaseComponent from '../base-component';
import { Employee, Position, Department } from '../models';

export default class EmployeeForm extends BaseComponent {
  @tracked employee: Employee;
  @tracked departments: Array<Department>;
  @tracked isUpdating: boolean = false;

  loadEmployee(employee) {
    Employee.includes({ positions: 'department' }).find(employee.id).then((response) => {
      this.isUpdating = true;
      this.employee = response.data;
      if (this.employee.positions.length === 0) {
        this.addPosition();
      }
    });
  }

  addPosition() {
    this.employee.positions.push(new Position());
    this.recalculateHistoricalIndices();
    this.employee = this.employee;
  }

  recalculateHistoricalIndices() {
    let positions = this.employee.positions.filter((p) => {
      return !p.isMarkedForDestruction();
    });

    positions.forEach((p, i) => {
      p.historicalIndex = i+1;
    });

    this.employee = this.employee;
  }

  removePosition(position) {
    position.isMarkedForDestruction(true);
    this.recalculateHistoricalIndices();
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
    this.args.context.formComponent = this;
    this.fetchDepartments();
    this.reset();
  }

  submit(e?) {
    if (e) e.preventDefault();

    this.employee.save({ with: { positions: 'department' }}).then((success) => {
      this.employee = this.employee;
      if (success) {
        this.args.context.searchComponent.search();
        this.reset();
      }
    });
  }

  reset() {
    this.isUpdating = false;
    let position = new Position({ historicalIndex: 1 });
    this.employee = new Employee({ positions: [position] });
  }
};
