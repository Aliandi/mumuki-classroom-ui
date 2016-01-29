
angular
  .module('classroom')
  .service('Api', function ($http, Auth, CONFIG) {

    const API = `${CONFIG.classroom.url}/api`;

    const authenticated = (requestOptions = {}) => _.defaultsDeep(requestOptions, {
      headers: { Authorization: `Bearer ${Auth.token()}` }
    })

    this.getCourses = () => {
      return $http
        .get(`${API}/courses`, authenticated())
        .then((res) => res.data.courses)
    };

    this.getGuides = ({ org, course }) => {
      return $http
        .get(`${API}/courses/${org}/${course}`, authenticated())
        .then((res) => res.data.course_guides)
    };

    this.getGuideProgress = ({ org, course, repo }) => {
      return $http
        .get(`${API}/guide_progress/${org}/${repo}`, authenticated())
        .then((res) => res.data.guide_progress)
    };

  });