#!/bin/bash
cd ..
docker build --tag monkey:1.2 -f docker/Dockerfile .
