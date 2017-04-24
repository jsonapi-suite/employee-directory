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
  @tracked currentPage = 1;

  constructor(options) {
    super(options);
    this.search();
  }

  @tracked('currentPage', 'totalCount')
  get hasNextPage() {
    return this.currentPage >= 1;
  }

  @tracked('currentPage', 'totalCount')
  get hasPrevPage() {
    return this.currentPage !== 1
  }

  paginate(e, back?) {
    let count = 1;
    if (back) count = -1;

    this.currentPage = this.currentPage + count;
    this.search();
  }

  search(e?) {
    if (e) e.preventDefault();

    let scope = Employee
      .includes({ current_position: 'department' })
      .page(this.currentPage)
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
