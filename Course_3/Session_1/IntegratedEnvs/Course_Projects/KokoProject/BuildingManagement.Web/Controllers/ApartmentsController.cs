using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Apartments;
using BuildingManagement.Web.Api.Apartments;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Web.Controllers;

public class ApartmentsController : Controller
{
    private readonly IApartmentsApiClient apartmentsApiClient;

    public ApartmentsController(IApartmentsApiClient apartmentsApiClient)
    {
        this.apartmentsApiClient = apartmentsApiClient;
    }

    public async Task<IActionResult> Index()
    {
        IReadOnlyCollection<ApartmentDto> apartments = await this.apartmentsApiClient.GetAllAsync();
        return View(apartments);
    }

    public IActionResult Create(int buildingId)
    {
        ApartmentDto model = new ApartmentDto
        {
            BuildingId = buildingId
        };
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ApartmentDto dto)
    {
        if (!this.ModelState.IsValid)
        {
            return View(dto);
        }

        await this.apartmentsApiClient.CreateAsync(dto);
        return RedirectToAction("Index", "Buildings");
    }
}

