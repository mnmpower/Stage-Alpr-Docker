FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

COPY dockerapi/. ./
RUN dotnet restore && dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app

RUN apt-get update && apt-get install -y openalpr openalpr-daemon openalpr-utils libopenalpr-dev
RUN cp -a /usr/share/openalpr/runtime_data/ocr/tessdata/*.traineddata /usr/share/openalpr/runtime_data/ocr/

RUN mkdir /ImageUploads 

COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "dockerapi.dll"]