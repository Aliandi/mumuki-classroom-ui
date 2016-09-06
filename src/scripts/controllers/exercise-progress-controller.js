
angular
  .module('classroom')
  .controller('ExerciseProgressController', function ($scope, $state, $sce, $stateParams, $filter, toastr, exercisesProgress, containsHtml, Auth, Api, Breadcrumb, Preferences, Humanizer) {

    Preferences($scope, 'viewMode');

    const exerciseToView = _.find(exercisesProgress, (progress) => progress.exercise.id === Number($stateParams.eid));

    $scope.exercisesProgress = exercisesProgress;

    let exerciseProgress = exerciseToView || exercisesProgress[0];

    $scope.selectExercise = (exerciseProgress) => {
      $stateParams.eid = exerciseProgress.exercise.id;
      $state.go($state.current.name, $stateParams, { reload: true });
    }

    Breadcrumb.setGuide(exerciseProgress.guide);
    Breadcrumb.setStudent(exerciseProgress.student);

    const diffs = exerciseProgress.diffs;

    const SPLIT = { type: 'side-by-side', name: 'split' };
    const UNIFIED = { type: 'line-by-line', name: 'unified' };
    const LAST_SOLUTION = { type: 'only-last', name: 'last_solution' };

    const MIN = 0;
    const MAX = diffs.length - 1 ;
    const course = $stateParams.course;

    const index = () => _.indexOf(diffs, $scope.selectedDiff);
    const prev = () => Math.max(index() - 1, MIN);
    const next = () => Math.min(index() + 1, MAX);

    $scope.lastDiff = () => _.last(diffs);

    $scope.first = () => $scope.selectDiff(_.first(diffs));
    $scope.last = () => $scope.selectDiff($scope.lastDiff());

    $scope.prev = () => $scope.selectDiff(diffs[prev()]);
    $scope.next = () => $scope.selectDiff(diffs[next()]);

    $scope.index = () => _.findIndex(diffs, $scope.isSelectedDiff);

    $scope.begin = () => {
      // This ugly logic is for fancy pagination;
      const number = _.floor($scope.index() / $scope.limit) * $scope.limit;
      const diffLengthBiggerThanLimit = diffs.length >= $scope.limit;
      const numberBiggerThandiffLength = number + $scope.limit >= diffs.length;

      return diffLengthBiggerThanLimit && numberBiggerThandiffLength ? (diffs.length - $scope.limit) : number;
    };

    if (_.isNull($scope.viewMode)) $scope.viewMode = UNIFIED;

    $scope.indexNumber = ($index) => _.padStart($scope.begin() + $index + 1, 2, '0');

    $scope.trust = (html) => $sce.trustAsHtml(html);
    $scope.containsHtml = containsHtml;
    $scope.selectDiff = (diff) => $scope.selectedDiff = diff;
    $scope.isSelectedDiff = (diff) => _.isEqual($scope.selectedDiff, diff);

    $scope.limit = 4;
    $scope.diffs = diffs;
    $scope.progress = exerciseProgress;
    $scope.lastSubmission = _.last(exerciseProgress.submissions);
    $scope.lastSubmissionDate = Humanizer.date($scope.lastSubmission.created_at);
    $scope.submissionsCount = exerciseProgress.submissions.length;

    $scope.selectDiff(diffs[MAX]);

    $scope.comments = (submission) => submission.comments;
    $scope.time = (comment) => moment(comment.date).fromNow();

    $scope.isLastSolutionActivated = () => _.isEqual($scope.viewMode, LAST_SOLUTION);
    $scope.getViewMode = () => $scope.viewMode;

    $scope.split = () => $scope.viewMode = SPLIT;
    $scope.unified = () => $scope.viewMode = UNIFIED;
    $scope.lastSolution = () => {
      $scope.selectDiff($scope.lastDiff());
      $scope.viewMode = LAST_SOLUTION;
    };

    const getComments = () => {
      Api.getComments(exerciseProgress.exercise.id, course)
        .then((data) => {
          const groupedComments = _.groupBy(data.comments, 'submission_id');
          _.each($scope.diffs, (submission, index) => {
            submission.right.comments = groupedComments[submission.right.id];
          });
        });
    };

    $scope.addComment = (submission) => {
      if (submission.comment) {
        const data = { exercise_id: exerciseProgress.exercise.id, submission_id: submission.id, comment: {
            content: submission.comment,
            type: submission.commentType,
            date: new Date(),
            email: Auth.profile().email
            }
        }
        Api.comment(data, course)
          .then(() => getComments())
          .then(() => toastr.success($filter('translate')('do_comment')))

        submission.restartComment();
      }
    }

    getComments();

  });
