using System.Collections.Generic;
using BuildingManagement.Common.FeeTypes;
using BuildingManagement.Common.Payments;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BuildingManagement.Web.Models.Payments;

public class PaymentFormViewModel
{
    public PaymentDto Payment { get; set; } = new PaymentDto();

    public List<SelectListItem> FeeTypes { get; set; } = new List<SelectListItem>();
}


