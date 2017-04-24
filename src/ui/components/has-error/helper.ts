export default function _hasError([obj, attribute, truthy, falsy]) {
  if (obj.errors[attribute] !== undefined) {
    return truthy;
  } else {
    return falsy;
  }
};
