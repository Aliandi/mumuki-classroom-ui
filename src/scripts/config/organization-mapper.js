
angular
  .module('classroom')
  .provider('OrganizationMapper', function (CONFIG) {

    let location;

    this.current = () => {
      return this.organizationMappers[CONFIG.organizationMappingMode];
    };

    const tenantizedURL = (URL, tenant) => {
      const [protocol, host] = URL.split('://');
      return `${protocol}://${tenant}.${host}`;
    };

    const withOrigin = (callback_uri) => `origin=${encodeURIComponent(callback_uri)}`;
    const withTenant = (tenant) => `organization=${tenant}`;

    const redirectURL = (tenant = '') => {
      const protocol = location.protocol();
      const host = location.host();
      const port = location.port();
      const portString = port ? `:${port}` : '';
      const path = _.isEmpty(tenant) ? '' : `/${tenant}`;
      return `${protocol}://${host}${portString}/#${path}/home`;
    };

    const withoutProtocol = (url) => url.replace(`${location.protocol()}://`, '');

    this.organizationMappers = {

      subdomain: {

        tenant() {
          var domain = withoutProtocol(CONFIG.classroom.url);
          return withoutProtocol(location.host().split(`.${domain}`)[0]);
        },

        laboratoryURL() {
          return tenantizedURL(CONFIG.laboratory.url, this.tenant());
        },

        classroomApiURL() {
          return tenantizedURL(CONFIG.classroom.api_url, this.tenant());
        },

        bibliothecaApiURL() {
          return CONFIG.bibliotheca.api_url;
        },

        loginURL() {
          return `${this.laboratoryURL()}/login?${withOrigin(location.absUrl())}&${withTenant(this.tenant())}`
        },

        logoutURL() {
          return `${this.laboratoryURL()}/logout?${withOrigin(redirectURL())}`
        },

        stateUrl() {
          return '';
        }

      },

      path: {

        tenant() {
          return location.url().split('/')[1];
        },

        laboratoryURL() {
          return `${CONFIG.laboratory.url}/${this.tenant()}`;
        },

        classroomApiURL() {
          return `${CONFIG.classroom.api_url}/${this.tenant()}`;
        },

        bibliothecaApiURL() {
          return CONFIG.bibliotheca.api_url;
        },

        loginURL() {
          return `${CONFIG.laboratory.url}/login?${withOrigin(location.absUrl())}&${withTenant(this.tenant())}`
        },

        logoutURL() {
          return `${CONFIG.laboratory.url}/logout?${withOrigin(redirectURL(this.tenant()))}`
        },

        stateUrl() {
          return '/:tenant';
        }

      }
    };

    this.$get = ($location) => {
      location = $location;
      return this.current();
    }

  });
