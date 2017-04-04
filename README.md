# media-moderator
A small web server calling two different logic apps based on the request path (/approve or /reject).

## Installation
This web server is based on the "express" npm package. After cloning this repository, you will therefore need to install the dependencies.
To do so, open a cmd prompt, navigate to your local repository, and type:

    npm install

You should see a new folder called "node_modules" in your repository.

## Configuration
This web server runs based on two POST URLS corresponding to two logic apps:
- the first logic app allows to "Approve" an asset.
- the second logic app allows to "Reject" an asset.

You will need to configure both Logic Apps URLs in the config.json file.

## Execution
To run the web server, please type:

    node media-moderator.js

The server will listen on http://localhost:3000.

The two requests accepted by this server are:

    http://localhost:3000/accept?assetId=<your_assetID>

and

    http://localhost:3000/reject?assetId=<your_assetID>
