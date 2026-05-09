3680 Final Project

Team:
- Frontend: Abubaker Ahmadi
- Backend: Ricardo Garcia Diaz  
- Database: Stephanie Esquivel

Tech Stack:
- Frontend:
- Backend: Node.js, Express.js
- Database: SQLite

Setup:

- Running the server:
- step 1:
cd database
sqlite3 ecommerce.db < schema.sql
sqlite3 ecommerce.db < data.sql
- step 2: 
cd backend
npm install
- step 3: 
node server.js

server will run on local host keep the terminal open, and press control + C when done 
## Testing the API

### Products
```bash
# get all products
curl http://localhost:3000/products

# filter by category
curl "http://localhost:3000/products?category=Fragrance Men"

# search by name or brand
curl "http://localhost:3000/products?search=chanel"
```

### Auth
```bash
# register
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'

# login
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
```

### Cart
```bash
# get cart items
curl http://localhost:3000/cart/1

# add item to cart
curl -X POST http://localhost:3000/cart -H "Content-Type: application/json" -d '{"user_id": 1, "product_id": 1, "quantity": 1}'

# remove item
curl -X DELETE http://localhost:3000/cart/1
```

### Coupons
```bash
# apply coupon
curl -X POST http://localhost:3000/coupons/apply -H "Content-Type: application/json" -d '{"code": "SAVE20", "cart_total": 95, "user_id": 1}'
```

## Important Notes
- Keep server running in Terminal 1 while testing
- Open new terminal (Cmd + N) for curl commands
- Do not press Ctrl+Z - use Ctrl+C to stop server
- ecommerce.db is gitignored and not pushed to GitHub

- Database: 
    - cd database
    - sqlite3 ecommerce.db < schema.sql
    - sqlite3 ecommerce.db < data.sql

- Backend:
    - cd backend
    - npm install
    - node server.js

- Frontend:
    - cd frontend 
    - npm install
    - npm run dev

Visit localhost

Notes:
- .db file is gitignored 





