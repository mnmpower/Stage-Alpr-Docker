FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

COPY AlprApp/. .
RUN dotnet restore && dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app

#Install nginx
RUN apt-get update
RUN apt-get install -y nginx && apt-get install -y systemd && apt-get install -y apt-utils && apt-get install -y libgdiplus && apt-get install -y libc6-dev
RUN ln -s /usr/lib/libgdiplus.so/usr/lib/gdiplus.dll

#Add the customized NGINX configuration
RUN rm -f /etc/nginx/nginx.conf && rm -f /etc/nginx/sites-enabled/*

COPY nginx/. /etc/nginx/.
RUN nginx -t

COPY script/nginx.sh /bin/.
COPY aspcert/aspnetapp.pfx /root/.aspnet/https/

COPY --from=build-env /app/out .
CMD ["sh", "/bin/nginx.sh"]