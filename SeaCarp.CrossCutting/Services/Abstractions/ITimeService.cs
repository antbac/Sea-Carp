namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ITimeService
{
    DateTime Now();

    DateTime Today();
}