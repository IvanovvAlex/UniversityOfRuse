using System;

namespace BuildingManagement.Common.Payments;

public class PaymentDto
{
    public int Id { get; set; }

    public int ResidentId { get; set; }

    public string ResidentName { get; set; } = string.Empty;

    public int FeeTypeId { get; set; }

    public string FeeTypeName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }

    public string MonthFor { get; set; } = string.Empty;
}


