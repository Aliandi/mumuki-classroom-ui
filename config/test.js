
angular
  .module('classroom')
  .constant('CONFIG', {

    classroom: {
      url: 'http://classroom.localmumuki.io'
    },

    laboratory: {
      url: 'http://laboratory.localmumuki.io'
    },

    bibliotheca: {
      url: 'http://bibliotheca.localmumuki.io'
    },

    cookie: {
      domain: 'localmumuki',
      session: '_mumuki_classroom_session'
    },

    organizationMappingMode: 'subdomain'

  });
