using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;
using BuildingManagement.Domain.FeeTypes;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeeTypesController : ControllerBase
{
    private readonly IFeeTypeService feeTypeService;

    public FeeTypesController(IFeeTypeService feeTypeService)
    {
        this.feeTypeService = feeTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<FeeTypeDto>>> GetAll()
    {
        IReadOnlyCollection<FeeTypeDto> feeTypes = await this.feeTypeService.GetAllAsync();
        return Ok(feeTypes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FeeTypeDto>> GetById(int id)
    {
        FeeTypeDto? dto = await this.feeTypeService.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<FeeTypeDto>> Create([FromBody] FeeTypeDto dto)
    {
        FeeTypeDto created = await this.feeTypeService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] FeeTypeDto dto)
    {
        bool updated = await this.feeTypeService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await this.feeTypeService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}


