# PRODUCTION MOVE BE

## Setup
1. Thêm file .env vào root
```env
PORT = 4111

JWT_SECRET = "プロダクトライフサイクルの秘密な鍵"
```

2. Migrate và seed database
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Start server
Development
```
npm run serverstart
```

Production
```
npm run start
```