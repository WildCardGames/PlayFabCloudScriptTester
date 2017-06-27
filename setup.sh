echo "Hello, "$USER". This script will setup your PlayFab testing environment"

echo -n "Enter the GitHub project name and press [ENTER]: "
read projectName

echo -n "Enter the titleId and press [ENTER]: "
read titleId

echo -n "Enter the developer secret key and press [ENTER]: "
read secretKey

echo -n "Enter the playfab player id titleId and press [ENTER]: "
read playerId

echo Run the following commands:
echo "export PF_TITLE_ID=$titleId"
echo "export PF_SECRET_KEY=$secretKey"
echo "export PF_PLAYER_ID=$playerId"

rm cloudscript.js && ln -s ../$projectName/MainCloudScript.js cloudscript.js
rm tests.js && ln -s ../$projectName/Tests/CloudScriptTests.js tests.js
