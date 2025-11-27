using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;
using BuildingManagement.Data;
using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Domain.FeeTypes;

public class FeeTypeService : IFeeTypeService
{
    private readonly BuildingManagementDbContext dbContext;

    public FeeTypeService(BuildingManagementDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<FeeTypeDto>> GetAllAsync()
    {
        List<FeeType> entities = await this.dbContext.FeeTypes
            .AsNoTracking()
            .OrderBy(f => f.Name)
            .ToListAsync();

        List<FeeTypeDto> result = entities
            .Select(ToDto)
            .ToList();

        return result;
    }

    public async Task<FeeTypeDto?> GetByIdAsync(int id)
    {
        FeeType? entity = await this.dbContext.FeeTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);

        if (entity == null)
        {
            return null;
        }

        FeeTypeDto dto = ToDto(entity);
        return dto;
    }

    public async Task<FeeTypeDto> CreateAsync(FeeTypeDto dto)
    {
        FeeType entity = new FeeType
        {
            Name = dto.Name,
            Description = dto.Description
        };

        this.dbContext.FeeTypes.Add(entity);
        await this.dbContext.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    public async Task<bool> UpdateAsync(int id, FeeTypeDto dto)
    {
        FeeType? entity = await this.dbContext.FeeTypes.FirstOrDefaultAsync(f => f.Id == id);
        if (entity == null)
        {
            return false;
        }

        entity.Name = dto.Name;
        entity.Description = dto.Description;

        await this.dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        FeeType? entity = await this.dbContext.FeeTypes.FirstOrDefaultAsync(f => f.Id == id);
        if (entity == null)
        {
            return false;
        }

        this.dbContext.FeeTypes.Remove(entity);
        await this.dbContext.SaveChangesAsync();
        return true;
    }

    private static FeeTypeDto ToDto(FeeType entity)
    {
        FeeTypeDto dto = new FeeTypeDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };
        return dto;
    }
}


