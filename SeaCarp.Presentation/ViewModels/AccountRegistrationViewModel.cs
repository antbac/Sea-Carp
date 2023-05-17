namespace SeaCarp.ViewModels;

public class AccountRegistrationViewModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
    public string ErrorMessage { get; set; }
}