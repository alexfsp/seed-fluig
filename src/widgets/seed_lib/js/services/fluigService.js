angular.module('seed.services')
  .factory('fluigService', ['$q', '$http', '$log', '$document', 'globalService',
    ($q, $http, $log, $document, globalService) => ({

      active: DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST),

      /**
       * Retorna os usuários do Fluig
       *
       * @returns
       */
      getUsuarios: function getUsuarios(userId, fields) {
        const constraints = [];
        let dataset;

        if (userId) {
          constraints.push(
            DatasetFactory.createConstraint('colleaguePK.colleagueId', userId, userId, ConstraintType.MUST)
          );
        }

        try {
          dataset = DatasetFactory.getDataset('colleague', null, constraints)
            .values;
        } catch (error) {
          $log.error('fluigService Error: ', error);
        }

        angular.forEach(dataset, (usuario) => {
          usuario.colleagueId = usuario['colleaguePK.colleagueId'];
        });

        return this.fixDataset(dataset, fields);
      },

      /**
       * Retorna dados de um dataset
       *
       * @param {any} name
       * @param {any} params
       * @param {any} fields
       * @returns
       */
      getDataset: function getDataset(name, params, fields, children) {
        const that = this;
        let dataset;

        const constraints = new Array(this.active);
        if (params) {
          Object.keys(params)
            .forEach((prop) => {
              if (params[prop]) {
                constraints.push(
                  DatasetFactory.createConstraint(prop, params[prop], params[prop], ConstraintType.MUST)
                );
              }
            });
        }

        try {
          dataset = DatasetFactory.getDataset(name, null, constraints)
            .values;

          if (children) {
            angular.forEach(dataset, (value) => {
              angular.forEach(children, (child) => {
                const c1 = DatasetFactory.createConstraint(
                  'tablename', child.name, child.name, ConstraintType.MUST
                );
                const c2 = DatasetFactory.createConstraint(
                  'metadata#id', value['metadata#id'], value['metadata#id'], ConstraintType.MUST
                );
                const c3 = DatasetFactory.createConstraint(
                  'metadata#version', value['metadata#version'], value['metadata#version'], ConstraintType.MUST
                );
                const constraintsFilhos = [c1, c2, c3];

                const datasetFilhos = DatasetFactory.getDataset(name, null, constraintsFilhos, null)
                  .values;

                value[child.name] = angular.toJson(that.fixDataset(datasetFilhos, child.fields));
                if (fields) {
                  fields.push(child.name);
                }
              });
            });
          }
        } catch (error) {
          $log.error(error);
        }

        return this.fixDataset(dataset, fields);
      },

      /**
       * Gera um id
       *
       * @returns
       */
      guid: function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return `${s4() + s4()}$${s4()}$${s4()}$${
                s4()}$${s4()}${s4()}${s4()}`;
      },

      /**
       * Remover propriedades não utilizadas do dataset
       *
       * @param {any} dataset - O dataset
       * @param {any} fields - Os campos do dataset
       * @returns
       */
      fixDataset: function fixDataset(_dataset, _fields, _lower) {
        const properties = [
          'Params',
          'Errors',
          'metadata#id',
          'metadata#parent_id',
          'metadata#version',
          'metadata#card_index_id',
          'metadata#card_index_version',
          'metadata#active',
          'cardid',
          'companyid',
          'documentid',
          'id',
          'tableid',
          'version'
        ];
        const dataset = _dataset;

        angular.forEach(dataset, (value) => {
          Object.keys(value)
            .forEach((key) => {
              if ($.inArray(key, properties) >= 0) { delete value[key]; }
              if (_fields && $.inArray(key, _fields) < 0) { delete value[key]; }

              if (value[key]) {
                value[key] = globalService.isJson(value[key]) ? angular.fromJson(value[key]) : value[key];
                if (_lower) {
                  value[key.toLowerCase()] = value[key];
                  if (key !== key.toLowerCase()) { delete value[key]; }
                }
              }
            });
        });

        return dataset;
      },
    })

  ]);
