namespace BuildingManagement.Common.Apartments;

public class ApartmentDto
{
    public int Id { get; set; }

    public int BuildingId { get; set; }

    public string ApartmentNumber { get; set; } = string.Empty;

    public int Floor { get; set; }

    public decimal? Area { get; set; }

    public string Notes { get; set; } = string.Empty;
}


