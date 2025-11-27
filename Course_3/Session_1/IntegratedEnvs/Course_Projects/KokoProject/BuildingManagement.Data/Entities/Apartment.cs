namespace BuildingManagement.Data.Entities;

public class Apartment
{
    public int Id { get; set; }

    public int BuildingId { get; set; }

    public string ApartmentNumber { get; set; } = string.Empty;

    public int Floor { get; set; }

    public decimal? Area { get; set; }

    public string Notes { get; set; } = string.Empty;

    public Building? Building { get; set; }

    public ICollection<Resident> Residents { get; set; } = new List<Resident>();
}


