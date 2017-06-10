angular
  .module('classroom')
  .service('Modal', function ($uibModal, $translate, Api) {

    this.exportCourseDataToJson = (course, onYesPromise) => {
      return this.confirmDialog(
        $translate('export_solutions_title', {courseName: course}),
        $translate('export_solutions_disclaimer'),
        onYesPromise
      );
    };

    this.removeStudent = (student, onYesPromise) => {
      return this.confirmDialog(
        student.fullName(),
        $translate('are_you_sure_delete_student_from_course'),
        onYesPromise
      );
    };

    this.detachStudent = (student, onYesPromise) => {
      return this.confirmDialog(
        student.fullName(),
        $translate('are_you_sure_detach_student_from_course'),
        onYesPromise
      );
    };

    this.attachStudent = (student, onYesPromise) => {
      return this.confirmDialog(
        student.fullName(),
        $translate('are_you_sure_attach_student_from_course'),
        onYesPromise
      );
    };

    this.confirmDialog = (title, text, onYesPromise) => $uibModal.open({
      templateUrl: 'views/modals/confirm-dialog.html',
      controller: 'ConfirmDialogController',
      resolve: {
        title: () => title,
        text: () => text,
        onYesPromise: () => onYesPromise
      }
    });

    this.transfer = (student, callback) => $uibModal.open({
      templateUrl: 'views/modals/transfer-student.html',
      controller: 'TransferStudentController',
      resolve: {
        student: () => student,
        courses: () => Api.getCourses(),
        callback: () => callback
      }
    });

    this.newMessage = (message, student, course, callback) => $uibModal.open({
      templateUrl: 'views/modals/new-message.html',
      controller: 'NewMessageController',
      resolve: {
        course: () => course,
        student: () => student,
        message: () => message,
        callback: () => callback
      }
    });

  });
