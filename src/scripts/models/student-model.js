
angular
  .module('classroom')
  .factory('Student', function () {

    class Student {

      constructor(student = {}) {
        _.defaultsDeep(student, { stats: this.defaultStats() });
        _.defaults(this, student);
      }

      fullName() {
        return `${this._capitalize(this.last_name)}, ${this._capitalize(this.first_name)}`
      }

      getName() {
        return this.fullName();
      }

      totalStats() {
        return this.stats.passed + this.stats.passed_with_warnings + this.stats.failed;
      }

      defaultStats() {
        return { passed: 0, failed: 0, passed_with_warnings: 0 };
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
