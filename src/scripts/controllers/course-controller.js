
angular
  .module('classroom')
  .controller('CourseController', function ($scope, $state, $stateParams, toastr, Api, Download, Modal, CurrentCourse) {

    const tabs = {
      guides: 'classroom.courses.course.guides',
      students: 'classroom.courses.course.students',
      teachers: 'classroom.courses.course.teachers',
      exams: 'classroom.courses.course.exams'
    }

    $scope.course = CurrentCourse.get();

    $scope.inviteStudents = () => {
      Modal.inviteStudents($scope.course, (expirationDate) => {
        return Api
          .postInvitation($stateParams.course, expirationDate)
          .then((invitation) => {
            $scope.course.invitation = invitation;
            CurrentCourse.set($scope.course);
          })
          .catch((e) => toastr.error(e));
      });
    }

    $scope.tabs = _.keys(tabs);
    $scope.open = (tab) => $state.go(tabs[tab], $stateParams, { location: 'replace' });
    $scope.is = (tab) => $state.is(tabs[tab], $stateParams);

    $scope.setCount = (count) => $scope.count = count;

    $scope.goToAddStudents = () => $state.go('classroom.students', $stateParams);

    $scope.export = () => {
      Modal.exportCourseDataToJson($stateParams.course, () => {
        return Api
          .getCourseProgress($stateParams.course)
          .then((data) => Download.json($stateParams.course, data.exercise_student_progress))
          .catch((e) => toastr.error(e));
      });
    }

  });
