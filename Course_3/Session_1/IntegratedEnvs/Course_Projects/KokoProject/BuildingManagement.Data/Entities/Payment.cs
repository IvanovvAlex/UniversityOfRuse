using System;

namespace BuildingManagement.Data.Entities;

public class Payment
{
    public int Id { get; set; }

    public int ResidentId { get; set; }

    public int FeeTypeId { get; set; }

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }

    public string MonthFor { get; set; } = string.Empty;

    public Resident? Resident { get; set; }

    public FeeType? FeeType { get; set; }
}


