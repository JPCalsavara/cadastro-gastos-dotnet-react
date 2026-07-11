# Etapa de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar os arquivos de projeto
COPY ["CadastroGastos.Api/CadastroGastos.Api.csproj", "CadastroGastos.Api/"]
COPY ["CadastroGastos.Domain/CadastroGastos.Domain.csproj", "CadastroGastos.Domain/"]
COPY ["CadastroGastos.Infrastructure/CadastroGastos.Infrastructure.csproj", "CadastroGastos.Infrastructure/"]
COPY ["CadastroGastos.Service/CadastroGastos.Service.csproj", "CadastroGastos.Service/"]

# Restaurar as dependências
RUN dotnet restore "CadastroGastos.Api/CadastroGastos.Api.csproj"

# Copiar todo o código-fonte restante
COPY . .

# Buildar e publicar
WORKDIR "/src/CadastroGastos.Api"
RUN dotnet publish "CadastroGastos.Api.csproj" -c Release -o /app/publish

# Etapa de Execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# O projeto ASP.NET 8 escuta por padrão na porta 8080 (novo comportamento do .NET 8)
EXPOSE 8080

ENTRYPOINT ["dotnet", "CadastroGastos.Api.dll"]
