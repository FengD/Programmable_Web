'use strict';


/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('MixCtrl', function ($scope, user,mix, CONFIG,FileUploader) {

    //** Scope
    /**=========================**/
    $scope.buf = [];
    $scope.mixName = "";
    $scope.listSongs = [];
    $scope.listTracks = [];
    $scope.priceSliders = [];
    $scope.slider = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.init = function () {
      mix.init($scope.buf, function(b){
        $scope.listSongs =b;
      });
    };

    $scope.getAllTracks = function(name) {
      mix.getAllTrackList(name, function(b){
        $scope.listTracks =b;
      });
    };

    $scope.play = function(n) {
      $scope.buf = mix.playAT(n);
    };

    $scope.pause = function () { // marche pas
      mix.pauseAT($scope.buf);
    };

    $scope.stop = function () { // marche pas
      mix.stopAT($scope.buf);
    };


    def();
    function def() {
      var l = 6;
      for( var i = 0 ; i < l ; i ++ ) {
        $scope.priceSliders.push(
          {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            vertical: true
          }
          }
        );
      }
    };


    /*** PAS COMPRIS **/

    $scope.save = function save(str) {
      if (str !== undefined && str !=="" ) {
        //console.log(uri);
        user.saveInfo(str);
      }else{
        alert("cann't be empty");
      }
    };

    $scope.get = function get(str) {
      if (str !== undefined && str !=="" ) {
        //console.log(uri);
        user.getInfo(str);
      }else{
        alert("cann't be empty");
      }
    };

    $scope.download = function download(uri) {
      //user.download('kkk');
    };

    $scope.uploader = new FileUploader({
      url: CONFIG.baseUrlApi + '/upload'
    });
    // Set file uploader music filter
    $scope.uploader.filters.push({
      name: 'soundFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|mp3|'.indexOf(type) !== -1;
      }
    });
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };

    // Upload music
    $scope.upload = function () {
      // Clear messages
      console.log('update');
      //$scope.success = $scope.error = null;
      // Start upload
      $scope.uploader.upload();
    };

    // Cancel the upload process
    $scope.cancel = function () {
      $scope.uploader.cancel();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

    // Remove the upload process
    $scope.remove = function () {
      $scope.uploader.remove();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

    $scope.changeMasterVolume = function () {
      console.log('kk');
      mix.changeMasterVolume();
    };

    $scope.muteUnmuteTrack = function () {
      console.log('muteUnmuteTrack');
      mix.muteUnmuteTrack();
    };

    $scope.changerangeslide = function (num) {
      console.log('changerangeslide');
      mix.changeRS(num);
    };
    $scope.loadOneSong = function (name) {
      console.log('loadSong');
      mix.loadOS(name);
    };
    $scope.pppp = function(){
      mix.combine($scope.buf);
    };

  });

