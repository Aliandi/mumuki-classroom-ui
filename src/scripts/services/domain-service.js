
angular
  .module('classroom')
  .service('Domain', function ($location, $window) {

    const openAth = (mode, path='') => {
      $window.open(`${this.atheneumURL()}${path}`, mode);
      return true;
    }

    this.atheneumURL = () => `${$location.protocol()}://${this.tenant()}.mumuki.io`;

    this.tenant = () => $location.host().split('classroom')[0].replace(/[.]$/g, '');

    this.openAtheneum = () => openAth('_self');
    this.openExamInAtheneum = (exam) => openAth('_blank', `/exams/${exam}`);

  });
