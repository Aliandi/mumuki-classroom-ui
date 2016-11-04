
angular
  .module('classroom')
  .factory('Guide', function (DevIcon, Domain) {

    class Guide {

      constructor(guide = {}) {
        _.defaults(this, guide);
      }

      getName() {
        return this.name;
      }

      getMumukiURL() {
        return `http://${Domain.tenant()}.mumuki.io/guides/${this.slug}`;
      }

      iconClass() {
        return `da da-${DevIcon.from(_.get(this, 'language.name'))}`;;
      }

      static from(guide) {
        return new Guide(guide);
      }

    }

    return Guide;

  })
