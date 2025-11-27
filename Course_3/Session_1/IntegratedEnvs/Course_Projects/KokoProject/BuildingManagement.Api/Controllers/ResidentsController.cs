using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Residents;
using BuildingManagement.Domain.Residents;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResidentsController : ControllerBase
{
    private readonly IResidentService residentService;

    public ResidentsController(IResidentService residentService)
    {
        this.residentService = residentService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ResidentDto>>> GetAll()
    {
        IReadOnlyCollection<ResidentDto> residents = await this.residentService.GetAllAsync();
        return Ok(residents);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ResidentDto>> GetById(int id)
    {
        ResidentDto? dto = await this.residentService.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ResidentDto>> Create([FromBody] ResidentDto dto)
    {
        ResidentDto created = await this.residentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ResidentDto dto)
    {
        bool updated = await this.residentService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await this.residentService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}


