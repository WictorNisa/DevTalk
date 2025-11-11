#!/bin/zsh

# Ensure mvnw is executable
if [[ ! -x "./mvnw" ]]; then
  chmod +x ./mvnw
fi
./mvnw spring-boot:run
read "?Press any key to continue..."