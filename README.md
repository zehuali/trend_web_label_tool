# Demo

http://zehuali.com/app

# Deployment

## Node.js

You have to install the node.js(v.10.x).
You can following this link https://nodejs.org/en/download/package-manager/
For Ubuntu: https://github.com/nodesource/distributions/blob/master/README.md#debinstall

## Backend

You can have you own backend server, I will use https://github.com/zehuali/my_node_server as an example.

### Download server part.

    git clone https://github.com/zehuali/my_node_server.git
    cd my_node_server
    npm install --all

The default port is 3001, you can change it to 80

    vi app.js

At line 51, change it to 80 and save.

### Start server

You can run it by

    npm start

Or if you need run it in backgound on 80 port.

    nohup sudo npm start &
  
## Frondend

In `my_node_server` folder

    git clone https://github.com/zehuali/trend_web_label_tool.git
    mv trend_web_label_tool react-app
    cd react-app
    npm install --all
    cp chart.zoom.js node_modules/chartjs-plugin-zoom/src/chart.zoom.js
  
### Change to your server ip.

    vi src/components/lineChart.jsx

At line 54 (or you can search keyword `http`) change url to your own server.

### Compile

    npm run build

## Mongodb

Install the Mongodb by https://docs.mongodb.com/manual/administration/install-on-linux/

To insert a new data, you can simply run (change the port which works for you):

    curl -X POST http://localhost:3001/data