
angular
  .module('classroom')
  .factory('Student', function () {

    class Student {

      constructor(student = {}) {
        _.defaults(this, student);
      }

      fullName() {
        return `${this._capitalize(this.last_name)}, ${this._capitalize(this.first_name)}`
      }

      getName() {
        return this.fullName();
      }

      totalStats() {
        return this.passed + this.passed_with_warnings + this.failed;
      }

      static from(student) {
        return new Student(student);
      }

      _capitalize(name) {
        return _(name).split(' ').map(_.capitalize).join(' ');
      }

    }

    return Student;

  })
