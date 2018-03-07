angular.module('SeedApp', ['angular.fluig', 'ngAnimate', 'seed.services'])

  .controller('SeedController', ['$scope', '$http', '$timeout', '$log', 'formService',
    function SeedController($scope, $http, $timeout, $log, formService) {
      const vm = this;
      formService.atualizaFormulario($scope, vm)
        .then(() => {
          vm.inicia();
        });

      vm.inicia = function inicia() {
        vm.Formulario.solicitante = "ALEX FERREIRA";
        vm.Formulario.gestor = "PAULA NASCIMENTO";
        vm.Formulario.diretor = "JOSE ARANTES";
        vm.Formulario.financeiro = "ADRIANA ASSUNCAO";
        vm.Formulario.data = new Date();
      };

      vm.adicionaDespesa = function adicionaDespesa() {
        vm.Formulario.despesas.push({});
      };

      vm.removeDespesa = function removeDespesa(despesa, $index) {
        FLUIGC.message.confirm({
          message: 'Deseja excluir esse registro?',
          title: 'Excluir despesa'
        }, (result) => {
          if (result) { vm.Formulario.despesas.slice($index, 1); }
        });
      };

    }
  ]);
