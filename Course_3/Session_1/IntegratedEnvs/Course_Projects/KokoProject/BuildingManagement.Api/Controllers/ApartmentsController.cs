using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Apartments;
using BuildingManagement.Domain.Apartments;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApartmentsController : ControllerBase
{
    private readonly IApartmentService apartmentService;

    public ApartmentsController(IApartmentService apartmentService)
    {
        this.apartmentService = apartmentService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ApartmentDto>>> GetAll()
    {
        IReadOnlyCollection<ApartmentDto> apartments = await this.apartmentService.GetAllAsync();
        return Ok(apartments);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApartmentDto>> GetById(int id)
    {
        ApartmentDto? dto = await this.apartmentService.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ApartmentDto>> Create([FromBody] ApartmentDto dto)
    {
        ApartmentDto created = await this.apartmentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ApartmentDto dto)
    {
        bool updated = await this.apartmentService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await this.apartmentService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}


