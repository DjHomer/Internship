using System;
namespace todoBE.Helper;


public class ForbiddenException : Exception
{
    public ForbiddenException() : base("Forbidden")
    {
        // Additional initialization if needed
    }

    public ForbiddenException(string message) : base(message)
    {
        // Additional initialization if needed
    }

    public ForbiddenException(string message, Exception innerException) : base(message, innerException)
    {
        // Additional initialization if needed
    }
}
