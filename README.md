# DXG Attendance App

This project consists of web services for a WFH attendance application in the hypotethical company "DXG" built using ExpressJs and MySQL. Employees are able to record their attendance by providing a proof image when doing their work at home in one specific day.

The app also provides an admin panel for HRD admins to view employee's data, update or delete them, as well as checking their WFH attendance history (view-only). An admin can also register a new employee into the system.

## How to run locally

The app is divided into three different microservices based on their domains. First, setup the database by following [this](db-setup/README.md) guide.

After that, setup each of the services individually by following the respective guides.

1. Auth Service
2. Employee Service
3. Attendance Service
