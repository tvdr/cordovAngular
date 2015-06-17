var myAppServices = angular.module('myAppServices',['ngCordova']);

myAppServices.factory('FileService',function($cordovaFile,$q){
        return{
        	
        	
            getFreeDisk : function(){
                
                document.addEventListener("deviceready", function () {
                   $cordovaFile.getFreeDiskSpace().then()
                }, false);
                
            },
            FileExists : function(Filename){
                
                
                    var deferred = $q.defer();
                    
                    $cordovaFile.checkFile(cordova.file.dataDirectory,Filename)
                            .then(function(success){
                                //console.log(success);
                                deferred.resolve(success);
                            },function(error){
                                //console.log(error);
                                deferred.reject(error);
                            });
                    
                    return deferred.promise;
                    
            },
            FileCreate : function(Filename,overWrite){
                 $cordovaFile.createFile(cordova.file.dataDirectory, Filename, overWrite)
                    .then(function (success) {
                      // success
                    }, function (error) {
                      // error
                    });
            },
            WriteFile : function(Filename,Data){
                var deferred = $q.defer();
                
                $cordovaFile.writeFile(cordova.file.dataDirectory, Filename,Data, true)
                .then(function(success){
                                //console.log(success);
                                deferred.resolve(success);
                            },function(error){
                                //console.log(error);
                                deferred.reject(error);
                            });
                    
                    return deferred.promise;
            },
            DeleteFile : function(Filename){
                
                var deferred = $q.defer();
                
                $cordovaFile.removeFile(cordova.file.dataDirectory, Filename)
                .then(function (success) {
                    // success
                    deferred.resolve(success);
                }, function (error) {
                    // error
                    deferred.reject(error);  
                });
                
                return deferred.promise;
            },
            ReadFile : function(Filename){
                var deferred = $q.defer();
                
                $cordovaFile.readAsText(cordova.file.dataDirectory, Filename)
                .then(function (success) {
                      deferred.resolve(success);
                }, function (error) {
                      deferred.reject(error);
                });
                
                return deferred.promise;
                
            },
            
            appendToFile: function(Filename,Text){
                var deferred = $q.defer();
                
                $cordovaFile.writeExistingFile(cordova.file.dataDirectory, Filename, Text)
                .then(function (success) {
                      deferred.resolve(success);
                }, function (error) {
                      deferred.reject(error);
                });
                
                return deferred.promise;
            }
        }
});


myAppServices.factory('PrintService',function($q){
    return {
        printArray: function(arrayToPrint){
            var deferred = $q.defer();
            
            bluetoothSerial.isConnected(function(){
                console.log('printer connected')
                if (arrayToPrint.length > 0){
                    arrayToPrint.forEach(function(line){
//                        line = line.trim();
                       bluetoothSerial.write(line+'\n',function(s){console.log('print: '+line+' '+s)},function(e){console.log('print: '+line+' '+e)});

                    });
                    bluetoothSerial.write('\n');
                    bluetoothSerial.write('\n');
                    bluetoothSerial.write('\n');
                    console.log('printed succcessfully');
                    deferred.resolve('Printed successfully');
                
                }else{
                    console.log('array is empty');
                    deferred.reject('array is empty');
                }

                //return deferred.promise;
            },function(){
                console.log('connecting to printer');
                bluetoothSerial.connect('00:19:5D:25:06:8C',function(){
                    if (arrayToPrint.length > 0){
                        arrayToPrint.forEach(function(line){
    //                        line = line.trim();
                           bluetoothSerial.write(line+'\n',function(s){console.log('print: '+line+' '+s)},function(e){console.log('print: '+line+' '+e)});

                        });
                        bluetoothSerial.write('\n');
                        bluetoothSerial.write('\n');
                        bluetoothSerial.write('\n');
                        console.log('printed succcessfully after connection');
                        deferred.resolve('Printed successfully');
                    }else{
                        console.log('array is empty after connection');
                        deferred.reject('array is empty');
                    }

                    //return deferred.promise;
                },function(e){console.log('connection error: '+e)});
            })
            
            
            //console.log(arrayToPrint);
            
            
        }
    }
});

myAppServices.factory('LogService',function($q,$cordovaFile,FileService){
    return {
        logEvent: function(filename,text){
            var deferred = $q.defer();

            text += "\n";  

            $cordovaFile.checkFile(cordova.file.dataDirectory,filename)
                            .then(function(success){
                                $cordovaFile.writeExistingFile(cordova.file.dataDirectory, filename, text)
                                        .then(function (success) {
                                              deferred.resolve(success);
                                        }, function (error) {
                                              deferred.reject(error);
                                        });
                            },function(error){
                                $cordovaFile.createFile(cordova.file.dataDirectory, filename, false)
                                    .then(function (success) {
                                      $cordovaFile.writeExistingFile(cordova.file.dataDirectory, filename, text)
                                        .then(function (success) {
                                              deferred.resolve(success);
                                        }, function (error) {
                                              deferred.reject(error);
                                        });
                                    }, function (error) {
                                      // error
                                    });
                            });
            
            console.log(text);
            console.log('is logged');
            
            return deferred.promise;
        },
        
        
        logDatas: function(filename){

            console.log('LogService -> logDatas')
            
            var deferred = $q.defer();
            var res = {
                crNb: 0,
                dbNb: 0,
                biNb: 0,
                totalTrNb: 0,
                collPoints: 0,
                debPoints: 0
            }
            
            FileService.ReadFile(filename).then(
                    function(s){

                        var strLines = s.split("\n");

                        for (var i in strLines) {
                            console.log(strLines[i]);
                            if (strLines[i] != ''){
                                var obj = JSON.parse(strLines[i]);
                                if (obj.type_id == 3){
                                    res.biNb++;
                                }
                                else if ((obj.type_id == 2)&&(obj.ajaxError == false)&&($.isArray(obj.responseData))){
                                    if (obj.responseData[1] == '000'){
                                        res.dbNb++;
                                        res.debPoints += parseInt(obj.responseData[2], 10);
                                    }
                                }
                                else if ((obj.type_id == 1)&&(obj.ajaxError == false)&&($.isArray(obj.responseData))){
                                    if (obj.responseData[1] == '000'){
                                        res.crNb++;
                                        res.collPoints += parseInt(obj.responseData[2], 10) + parseInt(obj.responseData[3], 10);
                                    }
                                }
                            }
                            res.totalTrNb = res.biNb + res.dbNb + res.crNb;
                        }
                        
                        deferred.resolve(res);
                        
                    }, function(e){
                        deferred.resolve(res);
                    })
            
            return deferred.promise;
        }
        
    }
});