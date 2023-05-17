Update database to latest version using:
----------------------------------------------------------------------------------------------------------------
dotnet ef database update --project:SeaCarp.Infrastructure --startup-project:SeaCarp.Presentation

Add a new migration using:
----------------------------------------------------------------------------------------------------------------
dotnet ef migrations add [MigrationName] --project:SeaCarp.Infrastructure --startup-project:SeaCarp.Presentation
