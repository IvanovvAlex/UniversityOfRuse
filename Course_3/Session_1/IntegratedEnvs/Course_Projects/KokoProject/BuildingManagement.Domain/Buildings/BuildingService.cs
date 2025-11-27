using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.Buildings;
using BuildingManagement.Data;
using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Domain.Buildings;

public class BuildingService : IBuildingService
{
    private readonly BuildingManagementDbContext dbContext;

    public BuildingService(BuildingManagementDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<BuildingDto>> GetAllAsync()
    {
        List<Building> entities = await this.dbContext.Buildings
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .ToListAsync();

        List<BuildingDto> result = entities
            .Select(ToDto)
            .ToList();

        return result;
    }

    public async Task<BuildingDto?> GetByIdAsync(int id)
    {
        Building? entity = await this.dbContext.Buildings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);

        if (entity == null)
        {
            return null;
        }

        BuildingDto dto = ToDto(entity);
        return dto;
    }

    public async Task<BuildingDto> CreateAsync(BuildingDto dto)
    {
        Building entity = new Building
        {
            Name = dto.Name,
            Address = dto.Address,
            Entrance = dto.Entrance,
            Notes = dto.Notes
        };

        this.dbContext.Buildings.Add(entity);
        await this.dbContext.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    public async Task<bool> UpdateAsync(int id, BuildingDto dto)
    {
        Building? entity = await this.dbContext.Buildings.FirstOrDefaultAsync(b => b.Id == id);
        if (entity == null)
        {
            return false;
        }

        entity.Name = dto.Name;
        entity.Address = dto.Address;
        entity.Entrance = dto.Entrance;
        entity.Notes = dto.Notes;

        await this.dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        Building? entity = await this.dbContext.Buildings.FirstOrDefaultAsync(b => b.Id == id);
        if (entity == null)
        {
            return false;
        }

        this.dbContext.Buildings.Remove(entity);
        await this.dbContext.SaveChangesAsync();
        return true;
    }

    private static BuildingDto ToDto(Building entity)
    {
        BuildingDto dto = new BuildingDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Address = entity.Address,
            Entrance = entity.Entrance,
            Notes = entity.Notes
        };
        return dto;
    }
}


