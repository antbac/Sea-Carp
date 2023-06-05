namespace SeaCarp.Presentation.ViewModels.Challenges;

public class Challenge
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Points { get; set; }
    public string[] Hints { get; set; }
    public ChallengeType Type { get; set; }
}