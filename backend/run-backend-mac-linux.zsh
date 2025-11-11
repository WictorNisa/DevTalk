#!/bin/zsh

# Ensure mvnw is executable
if [[ ! -x "./mvnw" ]]; then
  chmod +x ./mvnw
fi
./mvnw spring-boot:run
read -p 'Press any key to continue...' -n1 -r