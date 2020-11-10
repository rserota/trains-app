# Train Data Management App

## Installation
This application requires nodejs and npm to run. 
After installing npm, you can install the project's dependencies with `npm install`

This application uses postgreSQL to save data. You'll need to set environment variables for `PGDATABASE`, `PGUSER`, and `PGPASSWORD`, to specify an empty database, and a user with permission to write to it. 

## Running the application

After installing dependencies and setting up the database, run `npm start` to run the application. 


## Using the application

Upload a CSV in the proper format to create a train-run list. The IDs of the train-run lists appear on the right side of the screen.
Click on a train-run list to load the individual runs from that list in a table. If you want to make changes, you can delete individual items and create new ones.

