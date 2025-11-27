using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Residents;
using BuildingManagement.Web.Api.Residents;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Web.Controllers;

public class ResidentsController : Controller
{
    private readonly IResidentsApiClient residentsApiClient;

    public ResidentsController(IResidentsApiClient residentsApiClient)
    {
        this.residentsApiClient = residentsApiClient;
    }

    public async Task<IActionResult> Index()
    {
        IReadOnlyCollection<ResidentDto> residents = await this.residentsApiClient.GetAllAsync();
        return View(residents);
    }

    public IActionResult Create(int apartmentId)
    {
        ResidentDto model = new ResidentDto
        {
            ApartmentId = apartmentId
        };
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ResidentDto dto)
    {
        if (!this.ModelState.IsValid)
        {
            return View(dto);
        }

        await this.residentsApiClient.CreateAsync(dto);
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        ResidentDto? dto = await this.residentsApiClient.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, ResidentDto dto)
    {
        if (!this.ModelState.IsValid)
        {
            return View(dto);
        }

        bool updated = await this.residentsApiClient.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Delete(int id)
    {
        ResidentDto? dto = await this.residentsApiClient.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [ActionName("Delete")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        await this.residentsApiClient.DeleteAsync(id);
        return RedirectToAction(nameof(Index));
    }
}

