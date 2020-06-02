angular.module('seedApp', ['angular.fluig', 'ngAnimate', 'seed.services'])

  .controller('seedController', ['$scope', '$http', '$timeout', '$log', 'formService',
    function seedController($scope, $http, $timeout, $log, formService) {
      const vm = this;

      if (window.location.hostname == 'localhost') {
        angular.forEach(angular.element('[tablename]'),
          (value) => {
            const table = angular.element(value);
            angular.forEach(table.find('tbody'), tbody => {
              angular.element(tbody)
                .attr('ng-non-bindable', null);
              $compile(table)($scope);
            })
          });
      }

      formService.atualizaFormulario($scope, vm)
        .then(() => {
          vm.inicia();
        });

      vm.inicia = function inicia() {
        vm.checkLocal();
        vm.checkRegras();
      };

      vm.checkRegras = function checkRegras() {
        vm.etapas = ['consulta', 'inicio', 'revisarSolicitacao', 'analisarErros'];

        vm.regras = {};
        [
          { regra: 'showResumo', def: true, etapas: vm.etapas },
          { regra: 'showSolicitacao', def: true, etapas: ['inicio', 'consulta', 'revisarSolicitacao', 'analisarErros'] },
          { regra: 'enableSolicitacao', def: vm.Params.edit, etapas: ['inicio', 'revisarSolicitacao'] },


        ].forEach(o => {
          vm.regras[o.regra] = vm.Params.user == "adminx" && vm.Params.edit ? true : o.etapas.indexOf(vm.Params.etapa) >= 0 ? o.def : false;
        });
      }

      vm.removeChild = function removeChild(Array, item) {
        FLUIGC.message.confirm({
          message: 'Deseja excluir esse registro?',
          title: 'Excluir'
        }, (result) => {
          if (result) {
            Array.splice(Array.indexOf(item), 1);
            $scope.$apply();
          }
        });
      };

      vm.checkLocal = function checkLocal() {
        if (window.location.hostname == 'localhost') {
          vm.Params = {
            edit: true,
            etapa: "inicio",
            user: 'admin',
            formMode: 'ADD'
          };

          vm.Formulario.solicitante = "ALEX FERREIRA";
          vm.Formulario.gestor = "PAULA NASCIMENTO";
          vm.Formulario.diretor = "JOSE ARANTES";
          vm.Formulario.financeiro = "ADRIANA ASSUNCAO";
          vm.Formulario.data = new Date();

        }
      }

    }
  ]);
