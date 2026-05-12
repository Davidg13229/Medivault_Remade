# MediVault

## Prerequisites

- [Node.js](https://nodejs.org)
- [Laragon](https://laragon.org) (for MySQL)

## Setup

### 1. Start MySQL

Open Laragon and click **Start All**.

### 2. Import the Database

1. Click **Database** in Laragon to open HeidiSQL
2. Click on **Laragon.MySQL** in the session list on the left
3. Right-click the left panel and select **Create new** → **Database**
4. Name it `infoman` and click OK
5. Select the `infoman` database
6. Go to **File** → **Run SQL file**
7. Select `config/infoman (2).sql` and click Open
8. Click **Yes** on the encoding prompt

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

### 5. Open in Browser

```
http://localhost:3000
```

## Notes

- Laragon's MySQL root password is empty by default. The `config/database` file is already configured with `password: ''`.
- For development with auto-reload, install nodemon (`npm install -g nodemon`) and run `npm run dev`.
