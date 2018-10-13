
$http.get('/API/Usuario/').success(function (usuarios) {
  var returnAccount;
  angular.forEach(usuarios.contas, function (conta) {
    if (conta.id === id) {
      returnAccount = conta;
    }
  });
}).error(function (data, status) {
  customError.log(data, status);
});