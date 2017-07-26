angular.module('seed.services')
  .factory('globalService', () => ({
    isJson: function isJson(str) {
      try {
        angular.fromJson(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    replaceAll: function replaceAll(str, find, replace) {
      return str.split(find)
        .join(replace);
    },
    escapeRegExp: function escapeRegExp(str) {
      const regMetaChars = /[-\\^$*+?.()|[\]{}]/g;

      return str.replace(regMetaChars, '\\$1');
    },
    deepValue: function deepValue(_obj, _path) {
      const path = _path.split('.');
      const len = path.length;
      let obj = _obj;

      for (let i = 0; i < len; i += 1) {
        obj = obj[path[i]];
      }
      return obj;
    },
    /**
     * Associa um script ao DOM
     *
     * @param {any} src - A URL do script
     * @returns
     */
    appendScript: function appendScript(src) {
      const defer = $q.defer();
      try {
        if (angular.element(`script[src="${src}"]`)
          .length <= 0) {
          const script = $document[0].createElement('script');
          script.src = src;
          script.async = true;

          const onScriptLoad = function onScriptLoad() {
            defer.resolve();
          };

          script.onreadystatechange = onScriptLoad;
          script.onload = onScriptLoad;

          $document[0].querySelector('head')
            .appendChild(script);
        } else {
          defer.resolve();
        }
      } catch (error) {
        $log.error(error);
        defer.reject(error);
      }

      return defer.promise;
    },
  }))
  .filter('useFilter', function ($filter) {
    return function (value) {
      var filterName = [].splice.call(arguments, 1, 1)[0];

      if (filterName === '' || !filterName) {
        return value;
      }
      return $filter(filterName)
        .apply(null, arguments);
    };
  });
