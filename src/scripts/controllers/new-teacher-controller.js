
angular
  .module('classroom')
  .controller('NewTeacherController', function ($scope, $state, $filter, $stateParams, toastr, Api) {
    $scope.course = $stateParams.course;
    $scope.teacher = {
      first_name: '',
      last_name: '',
      email: ''
    };

    $scope.addTeacher = () => {
      Api.updateTeacher($scope.course, $scope.teacher)
        .then(() => toastr.success($filter('translate')('added_teacher')))
        .then(() => $state.go('classroom.courses.course.teachers', { course_slug: $scope.course }, { reload: true }))
        .catch((e) => toastr.error(e.data.message))
    }

  });
