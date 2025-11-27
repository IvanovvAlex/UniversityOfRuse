namespace BuildingManagement.Data.Entities;

public class Building
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string? Entrance { get; set; }

    public string? Notes { get; set; }

    public ICollection<Apartment> Apartments { get; set; } = new List<Apartment>();
}


