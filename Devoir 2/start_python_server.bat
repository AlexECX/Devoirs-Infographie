@echo off
if %1. ==. GOTO auto_port
"%~dp0/webserver/server/server.exe" %1
Exit /b

:auto_port
"%~dp0/webserver/server/server.exe" 8009
Exit /b

