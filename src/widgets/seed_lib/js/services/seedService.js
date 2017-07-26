angular.module('seed.services')
  .factory('seedService', ['$q', '$http', '$log', 'fluigService',
    ($q, $http, $log, fluigService) => ({

      getPrestacaoContas: function getPrestacaoContas(displaykey, fields) {
        return fluigService.getDataset('seed_prestacao_contas', {
          displaykey,
        }, fields);
      }

    })
  ]);
