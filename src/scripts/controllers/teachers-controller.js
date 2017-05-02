
angular
  .module('classroom')
  .controller('TeachersController', function ($scope, $state, $stateParams, teachers, Auth, Api, Domain, Modal, Breadcrumb, Permissions) {
    $scope.setCount(teachers.length);

    Breadcrumb.setCourse($stateParams.course);
    $scope.list = teachers;
    const course = $stateParams.course;
    const course_slug = `${Domain.tenant()}/${course}`;

    $scope.isHeadmaster = () => Permissions.isHeadmaster();

    $scope.newTeacher = () => $state.go('classroom.courses.course.teachers.new', $stateParams);

    $scope.sortCriteria = (teacher) => teacher.fullName();

  });
