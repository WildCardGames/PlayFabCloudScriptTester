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

// Server method swizzling - CloudScript methods are synchronous, and won't work unless they are in this list
var methodsToConvert = [
    "AddCharacterVirtualCurrency",
    "AddSharedGroupMembers",
    "AddUserVirtualCurrency",
    "AuthenticateSessionTicket",
    "AwardSteamAchievement",
    "ConsumeItem",
    "CreateSharedGroup",
    "DeleteCharacterFromUser",
    "DeleteSharedGroup",
    "DeleteUsers",
    "EvaluateRandomResultTable",
    "ExecuteCloudScript",
    "GetAllSegments",
    "GetAllUsersCharacters",
    "GetCatalogItems",
    "GetCharacterData",
    "GetCharacterInternalData",
    "GetCharacterInventory",
    "GetCharacterLeaderboard",
    "GetCharacterReadOnlyData",
    "GetCharacterStatistics",
    "GetContentDownloadUrl",
    "GetLeaderboard",
    "GetLeaderboardAroundCharacter",
    "GetLeaderboardAroundUser",
    "GetLeaderboardForUserCharacters",
    "GetPlayFabIDsFromFacebookIDs",
    "GetPlayFabIDsFromSteamIDs",
    "GetPlayerCombinedInfo",
    "GetPlayerSegments",
    "GetPlayerStatisticVersions",
    "GetPlayerStatistics",
    "GetPlayersInSegment",
    "GetPublisherData",
    "GetSharedGroupData",
    "GetTitleData",
    "GetTitleInternalData",
    "GetTitleNews",
    "GetUserAccountInfo",
    "GetUserData",
    "GetUserInternalData",
    "GetUserInventory",
    "GetUserPublisherData",
    "GetUserPublisherInternalData",
    "GetUserPublisherReadOnlyData",
    "GetUserReadOnlyData",
    "GetUserStatistics",
    "GrantCharacterToUser",
    "GrantItemsToCharacter",
    "GrantItemsToUser",
    "GrantItemsToUsers",
    "LogEvent",
    "ModifyItemUses",
    "MoveItemToCharacterFromCharacter",
    "MoveItemToCharacterFromUser",
    "MoveItemToUserFromCharacter",
    "NotifyMatchmakerPlayerLeft",
    "RedeemCoupon",
    "RedeemMatchmakerTicket",
    "RemoveSharedGroupMembers",
    "ReportPlayer",
    "RevokeInventoryItem",
    "SendPushNotification",
    "SetGameServerInstanceData",
    "SetGameServerInstanceState",
    "SetPublisherData",
    "SetTitleData",
    "SetTitleInternalData",
    "SubtractCharacterVirtualCurrency",
    "SubtractUserVirtualCurrency",
    "UnlockContainerInstance",
    "UnlockContainerItem",
    "UpdateCharacterData",
    "UpdateCharacterInternalData",
    "UpdateCharacterReadOnlyData",
    "UpdateCharacterStatistics",
    "UpdatePlayerStatistics",
    "UpdateSharedGroupData",
    "UpdateUserData",
    "UpdateUserInternalData",
    "UpdateUserInventoryItemCustomData",
    "UpdateUserPublisherData",
    "UpdateUserPublisherInternalData",
    "UpdateUserPublisherReadOnlyData",
    "UpdateUserReadOnlyData",
    "UpdateUserStatistics",
    "WriteCharacterEvent",
    "WritePlayerEvent",
    "WriteTitleEvent"
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
                
                if ( error ) log.error(error);
            });

            while(!done) deasync.runLoopOnce();

            return value.data;
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
// Load the tests
//

include('./tests.js')
