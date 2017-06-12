
angular
  .module('classroom')
  .service('Notification', function ($state, $stateParams, Domain, Api) {
    this.notifications = [];

    this.perPage = 15;

    this.set = (notifications) => {
      this.notifications = notifications;
    };

    this.hasNotifications = () => !_.isEmpty(this.notifications);

    this.remove = (id) => _.remove(this.notifications, {id: id});

    this.count = () => this.notifications.length;

    this.get = () => this.notifications;

    this.hasNotificationsBy = (filter = {}) => _.some(this.notifications, filter);

    this.goToAssignment = (notification) => {
      const [org, repo] = notification.assignment.guide.slug.split('/');
      const [__, course] = notification.assignment.course.split('/');
      $state.go('classroom.courses.course.guides.guide.students', {
        course: course,
        org: org,
        repo: repo,
        student: notification.sender,
        eid: notification.assignment.exercise.eid,
        tab: 'messages'
      });
    };

    this.getPage = (page = 0) => {
      if (page <= 0) page = 1;
      return Api.getNotificationsPage(page, this.perPage)
    };

    this.read = (notification) => {
      return Api.readNotification(notification.id)
                .then(() => notification.read = true)
                .then(() => this.remove(notification.id));
    }

    this.unread = (notification) => {
      return Api.unreadNotification(notification.id)
                .then(() => notification.read = false)
                .then(() => this.notifications.push(notification));
    }

    this.readAssignment = (assignment) => {
      const filter = {
        assignment: {
          course: `${Domain.tenant()}/${$stateParams.course}`,
          guide: { slug: assignment.guide.slug },
          exercise: {eid: assignment.exercise.eid },
          student: {uid: assignment.student.uid }
        }
      }
      _(this.notifications).filter(filter).forEach(this.read);
    }

  });
