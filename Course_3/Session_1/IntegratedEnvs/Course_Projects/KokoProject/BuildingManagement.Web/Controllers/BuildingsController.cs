using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Buildings;
using BuildingManagement.Web.Api.Buildings;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Web.Controllers;

public class BuildingsController : Controller
{
    private readonly IBuildingsApiClient buildingsApiClient;

    public BuildingsController(IBuildingsApiClient buildingsApiClient)
    {
        this.buildingsApiClient = buildingsApiClient;
    }

    public async Task<IActionResult> Index()
    {
        IReadOnlyCollection<BuildingDto> buildings = await this.buildingsApiClient.GetAllAsync();
        return View(buildings);
    }

    public IActionResult Create()
    {
        BuildingDto model = new BuildingDto();
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(BuildingDto dto)
    {
        if (!this.ModelState.IsValid)
        {
            return View(dto);
        }

        await this.buildingsApiClient.CreateAsync(dto);
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        BuildingDto? dto = await this.buildingsApiClient.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, BuildingDto dto)
    {
        if (!this.ModelState.IsValid)
        {
            return View(dto);
        }

        bool result = await this.buildingsApiClient.UpdateAsync(id, dto);
        if (!result)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Delete(int id)
    {
        BuildingDto? dto = await this.buildingsApiClient.GetByIdAsync(id);
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
        await this.buildingsApiClient.DeleteAsync(id);
        return RedirectToAction(nameof(Index));
    }
}


