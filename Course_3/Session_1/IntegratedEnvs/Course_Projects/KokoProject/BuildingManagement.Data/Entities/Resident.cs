namespace BuildingManagement.Data.Entities;

public class Resident
{
    public int Id { get; set; }

    public int ApartmentId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public bool IsOwner { get; set; }

    public Apartment? Apartment { get; set; }

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}


