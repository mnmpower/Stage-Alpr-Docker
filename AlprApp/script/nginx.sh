#!/bin/bash
service nginx start
dotnet /app/AlprApp.dll --urls http://127.0.0.1:5001