using System;

namespace BuildingManagement.Common.Payments;

public class PaymentDto
{
    public int Id { get; set; }

    public int ResidentId { get; set; }

    public int FeeTypeId { get; set; }

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }

    public string MonthFor { get; set; } = string.Empty;
}


