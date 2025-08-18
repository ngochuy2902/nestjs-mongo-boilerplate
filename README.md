## ❯ Scripts and Tasks

### Installation
- Node.js version 22.14.0
- Install all dependencies with `yarn install`

### Environment
- Create a `.env` file from the template `.env.example` file.
- Create database collection with name in MONGODB_URI

### Running the app
- Development mode with `yarn dev`

### Database Seeding

- Run seed script to create default users
  `yarn seed 00000000000000-add-default-user`
- Default Account
  - Super Admin
    - Username: `superadmin`
    - Password: `admin@123`
  - Admin
    - Username: `admin`
    - Password: `admin@123`
  - User
    - Username: `user`
    - Password: `user@123`

### Docker
- Create a `.env.docker` file from the template `.env.example` file.
- Start development stage
  `docker-compose up -d --build`
- Start production stage
  `TARGET=production docker-compose up -d --build`
- Shutdown
  `docker-compose down`

### Test
- Unit tests
  `yarn test`
- Test coverage
  `yarn test:cov`

### Format code
- `yarn lint`
- `yarn format`
