namespace BuildingManagement.Common.Buildings;

public class BuildingDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string? Entrance { get; set; }

    public string? Notes { get; set; }
}


