### Installation Guidelines


### Prerequisites

Python - Please install Python via either Anaconda or to the main system
Angular cli -  To install angular command line globally before running build commands (Use sudo for mac/linux) 
```
npm install -g @angular/cli@1.6.8 

npm install
```

### Dev Build Guidelines

npm install node-sass@4.8.1 resolves an error with newer versions of webpack and sass being incompatible
npm run build This will copy all the client files to server/dist folder
npm start will start the server at port 3000
```
npm install node-sass@4.8.1

npm run build 

npm start 
```


### To update repository

In the parent folder (usually called iasset or iasset-master), type the following

```
git pull

npm install

npm run build
```

### SQL Server Troubleshooting

If error is "Cannot connect (sequence)", please check if SQL Server Browser Service is running.
If not, Go to Control Panel -> Adminstrative Tools -> SQL Server Browser Service -> Enable

If error is Port for <instanceName> is not found", then please check if TCP/IP Is enabled.
Go to Sql Server Configuration Manager > SQL Server Network Configuration > Protocols for SQLSERVER > TCP/IP
