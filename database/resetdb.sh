#!/bin/bash

# rebuilds the database from scratch

rm -f ecommerce.db
sqlite3 ecommerce.db < schema.sql
sqlite3 ecommerce.db < data.sql
echo "database rebuilt successfully!"



