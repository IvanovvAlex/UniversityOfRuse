using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.Apartments;
using BuildingManagement.Data;
using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Domain.Apartments;

public class ApartmentService : IApartmentService
{
    private readonly BuildingManagementDbContext dbContext;

    public ApartmentService(BuildingManagementDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<ApartmentDto>> GetAllAsync()
    {
        List<Apartment> entities = await this.dbContext.Apartments
            .AsNoTracking()
            .Include(a => a.Building)
            .OrderBy(a => a.BuildingId)
            .ThenBy(a => a.Floor)
            .ThenBy(a => a.ApartmentNumber)
            .ToListAsync();

        List<ApartmentDto> result = entities
            .Select(ToDto)
            .ToList();

        return result;
    }

    public async Task<ApartmentDto?> GetByIdAsync(int id)
    {
        Apartment? entity = await this.dbContext.Apartments
            .AsNoTracking()
            .Include(a => a.Building)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (entity == null)
        {
            return null;
        }

        ApartmentDto dto = ToDto(entity);
        return dto;
    }

    public async Task<ApartmentDto> CreateAsync(ApartmentDto dto)
    {
        Apartment entity = new Apartment
        {
            BuildingId = dto.BuildingId,
            ApartmentNumber = dto.ApartmentNumber,
            Floor = dto.Floor,
            Area = dto.Area,
            Notes = dto.Notes
        };

        this.dbContext.Apartments.Add(entity);
        await this.dbContext.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    public async Task<bool> UpdateAsync(int id, ApartmentDto dto)
    {
        Apartment? entity = await this.dbContext.Apartments.FirstOrDefaultAsync(a => a.Id == id);
        if (entity == null)
        {
            return false;
        }

        entity.BuildingId = dto.BuildingId;
        entity.ApartmentNumber = dto.ApartmentNumber;
        entity.Floor = dto.Floor;
        entity.Area = dto.Area;
        entity.Notes = dto.Notes;

        await this.dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        Apartment? entity = await this.dbContext.Apartments.FirstOrDefaultAsync(a => a.Id == id);
        if (entity == null)
        {
            return false;
        }

        this.dbContext.Apartments.Remove(entity);
        await this.dbContext.SaveChangesAsync();
        return true;
    }

    private static ApartmentDto ToDto(Apartment entity)
    {
        ApartmentDto dto = new ApartmentDto
        {
            Id = entity.Id,
            BuildingId = entity.BuildingId,
            BuildingName = entity.Building?.Name ?? string.Empty,
            ApartmentNumber = entity.ApartmentNumber,
            Floor = entity.Floor,
            Area = entity.Area,
            Notes = entity.Notes
        };
        return dto;
    }
}


