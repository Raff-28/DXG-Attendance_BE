## Attendance Service Setup

This service handles logic & operations related to employee's attendance, such as posting and retrieving attendance data. To setup the service:

1. Create a [cloudinary](https://cloudinary.com/) account (required for storing WFH proof images). Then, follow the [official guide](https://cloudinary.com/documentation/finding_your_credentials_tutorial) to retrieve your API keys.

2. Create a .env file following .env.example (adjust depending on personal configurations). Input your cloudinary API keys from the step 1 here.

   Note: CLOUDINARY_TARGET_FOLDER is optional if you want to store all the images from this app in a specific folder. If not filled then it will be uploaded into the home directory.

```
SERVICE_PORT=4003
AUTH_SERVICE_BASE_URL=http://localhost:4001
EMPLOYEE_SERVICE_BASE_URL=http://localhost:4002

DB_USERNAME=root
DB_PASSWORD=
DB_NAME=hr_module_db
DB_HOST=localhost
DB_PORT=3306

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_TARGET_FOLDER=
```

3. Install dependencies

```
npm install
```

4. Compile project into JS and run it

```
npm run build
npm start
```

5. Or run in development server

```
npm run dev
```
