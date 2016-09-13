
angular
  .module('classroom')
  .factory('Exercise', function (Submission) {

    class Exercise {

      constructor(exercise = {}) {
        if (!_.isNumber(exercise.number)) {
          exercise.number = 0;
        }
        _.defaults(this, exercise);
      }

      getName() {
        return this.number ? `${ this.number }. ${ this.name }` : `${ this.name }`;
      }

      lastSubmission() {
        return _.maxBy(_.get(this, 'submissions', []), 'created_at');
      }

      penultimateSubmission() {
        const submissions = _.get(this, 'submissions', []);
        return _.sortBy(submissions, 'created_at')[submissions.length - 2];
      }

      static from(exercise) {
        exercise.submissions = _.map(exercise.submissions, Submission.from);
        return new Exercise(exercise);
      }

    }

    return Exercise;

  })
