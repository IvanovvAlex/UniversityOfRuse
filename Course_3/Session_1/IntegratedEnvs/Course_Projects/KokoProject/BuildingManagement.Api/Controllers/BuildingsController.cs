using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Buildings;
using BuildingManagement.Domain.Buildings;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuildingsController : ControllerBase
{
    private readonly IBuildingService buildingService;

    public BuildingsController(IBuildingService buildingService)
    {
        this.buildingService = buildingService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<BuildingDto>>> GetAll()
    {
        IReadOnlyCollection<BuildingDto> buildings = await this.buildingService.GetAllAsync();
        return Ok(buildings);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BuildingDto>> GetById(int id)
    {
        BuildingDto? dto = await this.buildingService.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<BuildingDto>> Create([FromBody] BuildingDto dto)
    {
        BuildingDto created = await this.buildingService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] BuildingDto dto)
    {
        bool updated = await this.buildingService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await this.buildingService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}


