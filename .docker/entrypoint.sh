#!/bin/bash

npm install
npm prisma generate
npm prisma migrate dev
npm run dev
