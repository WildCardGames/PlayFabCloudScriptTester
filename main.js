'use strict';

// Testing Ultimate Cribbage

// Configuration
process.env.ENV_VARIABLE

var titleId = process.env.PF_TITLE_ID;
var secretKey = process.env.PF_SECRET_KEY;
var currentPlayerId = process.env.PF_PLAYER_ID;

// Setup
var fs = require('fs');
var vm = require('vm');

var deasync = require('deasync');
var server = require("playfab-sdk/PlayFabServer.js");

server.settings.titleId = titleId;
server.settings.developerSecretKey = secretKey;

var log = {
    info: function(msg) {
        console.log(msg);
    },
    error: function(msg) {
        console.error(msg);
    },
    json: function(o) {
        log.info(JSON.stringify(o));
    }
}

// Server method swizzling - CloudScript methods are synchronous
var methodsToConvert = [
    "GetUserData",
    "UpdateUserData",

    "GetPlayerStatistics",
    "UpdatePlayerStatistics",
    "GetPlayersInSegment"
];

for( var i = 0; i < methodsToConvert.length; i++ )
{
    var methodName = methodsToConvert[i];
    var oldMethodName = methodName + "_orig";

    server[oldMethodName] = server[methodName];

    (function() {
        var name = methodName;
        var oldName = oldMethodName;

        server[name] = function(args) {
            var done = false;
            var value = null;

            server[oldName](args, function(error, result) {
                done = true;
                value = result;
                
                if ( error ) {
                    log.error(name + ":");
                    log.error(error);
                }
            });

            while(!done) deasync.runLoopOnce();

            if ( value ) {
                return value.data;
            } else {
                return null;
            }
        }
    })();
}

function include(filename) {
    var content = fs.readFileSync(filename) + '';
    eval(content);
}

var handlers = {};

//
// Load Your CloudScript
//

include('./cloudscript.js')

//
// Start of testing section. Invoke your handlers here
//

include('./tests.js')
