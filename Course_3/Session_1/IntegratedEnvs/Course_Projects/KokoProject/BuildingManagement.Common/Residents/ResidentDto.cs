namespace BuildingManagement.Common.Residents;

public class ResidentDto
{
    public int Id { get; set; }

    public int ApartmentId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public bool IsOwner { get; set; }
}


