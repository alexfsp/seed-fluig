angular.module('seed.services')
  .factory('formService', ['$q', '$http', '$compile', '$timeout', '$log', 'globalService',
    ($q, $http, $compile, $timeout, $log, globalService) => ({
      /**
       * Atualiza os dados do formulário com as informações recebidas pelo Fluig
       *
       * @param {any} scope
       * @param {any} fields
       */
      atualizaFormulario: function atualizaFormulario(scope, vm) {
        const loading = FLUIGC.loading('body');

        angular.element('form')
          .hide();

        loading.show();

        const defer = $q.defer();

        scope.$watch('$viewContentLoaded', () => {
          vm.Formulario = {};
          vm.Errors = [];

          this.updateChildren(scope);

          if (angular.element('#Params')
            .val() !== '') {
            vm.Params = angular.fromJson(angular.element('#Params')
              .val());
          } else {
            vm.Params = {
              edit: true,
              etapa: 'inicio'
            };
          }

          const fields = [];

          angular.forEach(angular.element('[ng-value]'), (value) => {
            const a = angular.element(value);

            if (a.attr('name')) {
              const name = a.attr('name');

              if (fields.indexOf(name) < 0) {
                fields.push(name);
                const element = angular.element(`[name='${name}']`);

                if (element.val() !== '') {
                  vm.Formulario[name] =

                    globalService.isJson(element.val()) ?
                    angular.fromJson(element.val()) :
                    element.val();
                }
              }
            }
          });

          parent.$('body')
            .find('#ecm-cardPublisher-principal')
            .css('height', '100%');
          parent.$('.feedback-btn')
            .hide();

          scope.processDefinition =
            parent.ECM.workflowView ? parent.ECM.workflowView.processDefinition : {};

          defer.resolve();
          loading.hide();
          $timeout(() => {
            angular.element('form')
              .fadeIn();
          });
        });

        return defer.promise;
      },

      updateChildren: function updateChildren(scope) {
        const rows = [];

        // busca todos os elementos com ng-child
        angular.forEach(angular.element('[ng-child]'),
          (value) => {
            const element = angular.element(value);

            const name = element.attr('name') ? element.attr('name') : element.attr('id');

            if (name) {
              if (name.indexOf('___') >= 0) {
                const child = element.attr('ng-child');

                const fluigId = name.split('___')[1];

                const html = globalService.replaceAll(element.html(), child, `${child}___${fluigId}`);

                element.html(html);

                // aplica
                this.applyChildTags(element);
                angular.forEach(element.children(),
                  (childValue) => {
                    this.applyChildTags(angular.element(childValue));
                  });

                element.removeAttr('ng-child');
                let parent = element[0];

                while (parent !== null) {
                  if (parent.nodeName.toUpperCase() === 'TR') {
                    if (rows.indexOf(parent) < 0) {
                      rows.push(parent);
                    }
                    parent = null;
                  }

                  if (parent) { parent = parent.parentNode; }
                }
              }
            }
          });

        angular.forEach(rows, (row) => {
          $compile(row)(scope);
        });
      },

      applyChildTags: function applyChildTags(element) {
        const ngChildTags = element.attr('ng-child-tags');
        if (ngChildTags) {
          const tags = angular.fromJson(ngChildTags);
          Object.keys(tags)
            .forEach((key) => {
              if (key) { element.attr(key, tags[key]); }
            });

          element.removeAttr('ng-child-tags');
        }
      },

      carregaItens: function carregaItens(table) {
        const Dados = [];
        angular.forEach(angular.element(`${table} tr td input`),
          (value) => {
            const element = angular.element(value);
            const name = element.attr('name');
            const field = name.split('___')[0];
            const id = name.split('___')[1];
            let index = Dados.map(x => x.id)
              .indexOf(id);

            if (id) {
              if (index < 0) {
                index = Dados.push({
                  id
                }) - 1;
              }

              Dados[index][field] = element.val();
            }
          });

        return Dados;
      }
    })
  ]);
