## Employee Service Setup

This service handles logic & operations related to employees. To setup the service:

1. Create a .env file following .env.example (adjust depending on personal configurations)

```
SERVICE_PORT=4002
AUTH_SERVICE_BASE_URL=http://localhost:4001

DB_USERNAME=root
DB_PASSWORD=
DB_NAME=hr_module_db
DB_HOST=localhost
DB_PORT=3306
```

2. Install dependencies

```
npm install
```

3. Compile project into JS and run it

```
npm run build
npm start
```

4. Or run in development server

```
npm run dev
```
