#!/bin/bash
# Usage: Pass VM's IP as an argument
# ./test.sh <VM_IP_ADDRESS>
IP=$1
response=$(curl -s -o /dev/null -w "%{http_code}" http://$IP:3000/status)

if [ "$response" == "200" ]; then
  echo "Application is running successfully!"
else
  echo "Application failed to start! HTTP Status: $response"
fi

response=$(curl -s -o /dev/null -w "%{http_code}" http://$IP:3000/orders)
if [ "$response" == "200" ]; then
  echo "Get all orders endpoint is running successfully!"
else
  echo "Get all orders endpoint failed! HTTP Status: $response"
fi
