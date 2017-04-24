import Component from '@glimmer/component';

export default class BaseComponent extends Component {
  updateInput(obj, attribute, e) {
    obj[attribute] = e.target.value;
  }

  destroyModel(model) {
    model.isMarkedForDestruction(true);
  }
}
