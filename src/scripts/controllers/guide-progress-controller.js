
angular
  .module('classroom')
  .controller('GuideProgressController', function ($scope, $stateParams, $interval, $controller, data, Api, Guide, Breadcrumb, Humanizer, Notification) {

    $controller('ListHeaderController', {
      $scope: $scope,
      list: data.guideProgress,
      itemTemplate: 'views/templates/item-guide-progress.html',
      uidField: 'student.uid'
    });

    const guide = Guide.from(data.guide);
    const guideProgressFetcher = $interval(() => Api.getGuideProgress($stateParams).then((data) => setGuideProgress(data.guideProgress)), 5000);

    Breadcrumb.setCourse($stateParams.course);
    Breadcrumb.setGuide(guide);

    const setGuideProgress = (guideProgresses) => {
      guideProgresses.forEach((guideProgress) => {
        const item = _.find($scope.list, (item) => item.student.uid === guideProgress.student.uid)
        if (item) _.merge(item, guideProgress);
        else $scope.list.push(guideProgress);
      });
    }

    $scope.Humanizer = Humanizer;

    $scope.availableSortingCriterias = [
      { type: 'name', properties: ['student.last_name', 'student.first_name']},
      { type: 'progress', properties: ['stats.total', 'passedAverage()', 'student.last_name', 'student.first_name']},
      { type: 'last_submission_date', properties: ['-lastSubmission().created_at', 'student.last_name', 'student.first_name']}
    ];

    setGuideProgress(data.guideProgress);

    $scope.guide = guide;
    $scope.withDetachedStudents = false;

    $scope.$on('$destroy', () => $interval.cancel(guideProgressFetcher));

    $scope.hasNotifications = (guideProgress) => {
      return Notification.hasNotificationsBy({
        organization: guideProgress.organization,
        course: `${guideProgress.organization}/${$stateParams.course}`,
        assignment: {
          guide: { slug: guideProgress.guide.slug },
          student: { uid: guideProgress.student.uid }
        }
      })
    };


  });
