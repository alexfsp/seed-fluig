angular.module('seed.services')
  .factory('erpService', ['$http', '$log', 'fluigService',
    ($http, $log, fluigService) => ({

      /**
       * Retorna os estabelecimentos cadastrados no ERP
       *
       * @param {string} cod_empresa
       * @returns
       */
      getEstabelecimento: function getEstabelecimento(codigo) {
        const constraints = [];
        let dataset;

        if (codigo) {
          constraints.push(DatasetFactory.createConstraint('codigo', codigo, codigo, ConstraintType.MUST));
        }

        try {
          dataset = DatasetFactory.getDataset('seed_erp_consulta_estabelecimento', null, constraints)
            .values;
        } catch (error) {
          $log.error(error);
        }

        return fluigService.fixDataset(dataset, null, true);
      },

    })
  ]);
