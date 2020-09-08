# PlayFabCloudScriptTester
Contains an Node.js environment for quickly testing cloud script code on PlayFab

Manual setup:
1. Replace `tests.js` with a symlink to your test script (something like `ln -s ../foo_project/tests/MyTestScripts.js`)
2. Replace `cloudscript.js` with a sym link to your cloudscript (something like `ln -s ../foo_project/MainCloudScript.js`)
3. Set the following environment variables
  - PF_TITLE_ID
  - PF_SECRET_KEY
  - PF_PLAYER_ID
  
Script Setup:
1. Gather your project name, title id (dev env), secret key, and test player id
2. Run `setup.sh` and provide the requested info
  
Running Tests  
1. Run `node main.js`
