# Demo

http://zehuali.com/app

# Before you start

## Node.js
Node.js (v.10.x) is needed.
You can following this link https://nodejs.org/en/download/package-manager/
For Ubuntu: https://github.com/nodesource/distributions/blob/master/README.md#debinstall

## Mongodb
Install the Mongodb by https://docs.mongodb.com/manual/administration/install-on-linux/

## Firewall
Be sure that the port to be used by this app is open in AWS's firewall setting. 
https://ec2-tutorials.readthedocs.io/en/latest/configure-firewall.html


# Deployment

## Backend

You can have you own backend server, I will use https://github.com/zehuali/my_node_server as an example.

### Download server part.

    git clone https://github.com/zehuali/my_node_server.git
    cd my_node_server
    npm install --all

The default port is 3001, you can change it to 80 in line 51 of `app.js`

### Start server

You can run it by

    npm start

Or if you need to run it in backgound on 80 port.

    nohup sudo npm start &
  
## Frondend

In `my_node_server` folder or local machine

    git clone https://github.com/forrestbao/trend_web_label_tool.git react-app
    cd react-app
    npm install --all
    cp chart.zoom.js node_modules/chartjs-plugin-zoom/src/chart.zoom.js
  
### Change to your server's IP

    vi src/components/lineChart.jsx

At line 54 (or you can search keyword `http`) change url to your own server.

### Build

    npm run build
    
### Deploy (If built in local machine)

    scp -r ./build username@hostname:/path/to/my_node_server/react-app/

## Insert data into Mongodb

Run the command below to insert one channel of random time series 
(change the port which works for you)
into the database:

    curl -X POST http://MY_SERVER_IP_OR_NAME:3001/data
