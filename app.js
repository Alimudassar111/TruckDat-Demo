var module = angular.module('app', ['ui.bootstrap']);

module.service('ContactService', function() {
  //to create unique contact id
  var uid = 1;

  //contacts array to hold list of all contacts
  var contacts = [{
    id: 0,
    'name': 'Mike',
    'description': 'Apple',
    'pickuplocation': 'Duabi',
    'dropofflocation': 'Lahore',
    'time':'12:00AM',
    'date':'03-05-2014'
  }, {
    id: 1,
    'name': 'Wright',
    'description': 'Balls',
    'pickuplocation': 'London',
    'dropofflocation': 'New York',
    'time':'10:00AM',
    'date':'03-05-2014'

  }];

  //save method create a new contact if not already exists
  //else update the existing object
  this.save = function(contact) {
    if (typeof(contact.id) == "undefined") {
      //if this is new contact, add it in contacts array
      contact.id = uid++;
      contacts.push(contact);
    } else {
      //for existing contact, find this contact using id
      //and update it.
      for (i in contacts) {
        if (contacts[i].id == contact.id) {
          contacts[i] = contact;
        }
      }
    }

  }

  //simply search contacts list for given id
  //and returns the contact object if found
  this.get = function(id) {
    for (i in contacts) {
      if (contacts[i].id == id) {
        return contacts[i];
      }
    }

  }

  //iterate through contacts list and delete 
  //contact if found
  this.delete = function(id) {
    for (i in contacts) {
      if (contacts[i].id == id) {
        contacts.splice(i, 1);
      }
    }
  }

  //simply returns the contacts list
  this.list = function() {
    return contacts;
  }
});

module.controller('ContactController', function($scope, $modal, $log, ContactService) {

  $scope.contacts = ContactService.list();
  $scope.delete = function(id) {
    ContactService.delete(id);
    
    //if ($scope.form.id == id) $scope.form = {};
  }
  $scope.edit = function(id) {
    console.log(id);
    //trigger modal
    var modalInstance = $modal.open({
      templateUrl: 'form.html',
      controller: ModalInstanceCtrl,
      resolve: {
        contacts: function() {
          if(typeof(id) != "undefined"){
          return angular.copy(ContactService.get(id));
          }
          return false;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
    
    //$scope.form = angular.copy(ContactService.get(id));
  }
  
  var ModalInstanceCtrl = function ($scope, $modalInstance, contacts) {
  if(contacts===false){
  $scope.form = {};
  } else {
      $scope.form = contacts; 
  }

  $scope.selected = {
    contact: $scope.form[0]
  };

  $scope.saveContact = function() {
    ContactService.save($scope.form);
    $scope.form = {};
    $modalInstance.close($scope.selected.contact);
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  

  };

});

