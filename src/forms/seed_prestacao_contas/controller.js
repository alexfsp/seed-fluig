angular.module('AdfApp', ['adf.directives', 'adf.services', 'angular.fluig', 'ngAnimate'])

  .controller('AdfController', ['$scope', '$http', '$timeout', '$log', 'erpService', 'fluigService', 'formService', 'adfService',
    function AdfController($scope, $http, $timeout, $log, erpService, fluigService, formService, adfService) {
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
        wdkAddChild('despesas');
        formService.updateChildren($scope);
      };

      vm.removeDespesa = function removeDespesa($event) {
        FLUIGC.message.confirm({
          message: 'Deseja excluir esse registro?',
          title: 'Excluir despesa'
        }, (result) => {
          if (result) { fnWdkRemoveChild($event.currentTarget); }
        });
      };

    }
  ]);
