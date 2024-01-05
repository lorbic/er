wrangler d1 execute YOUR_DATABASE_NAME \
  --local --command "select * from urls"

wrangler d1 execute YOUR_DATABASE_NAME \
  --local --command "CREATE TABLE IF NOT EXISTS users ( user_id INTEGER PRIMARY KEY, email_address TEXT, created_at INTEGER, deleted INTEGER, settings TEXT);"

wrangler d1 execute DB --local --persist-to=_data/data.bin --command "select * from urls"

wrangler  d1 execute DB --local --persist-to=_data/data.bin --command "CREATE TABLE IF NOT EXISTS urls (short_code TEXT PRIMARY KEY, created_at INTEGER, url TEXT);"

wrangler  d1 execute DB --local --persist-to=_data/data.bin --command "insert into urls(short_code,  url, created_at) values('gh', 'https://github.com', 1704477864);"


