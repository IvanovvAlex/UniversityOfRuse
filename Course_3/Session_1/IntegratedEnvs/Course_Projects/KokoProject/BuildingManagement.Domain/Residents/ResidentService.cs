using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.Residents;
using BuildingManagement.Data;
using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Domain.Residents;

public class ResidentService : IResidentService
{
    private readonly BuildingManagementDbContext dbContext;

    public ResidentService(BuildingManagementDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<ResidentDto>> GetAllAsync()
    {
        List<Resident> entities = await this.dbContext.Residents
            .AsNoTracking()
            .Include(r => r.Apartment)
            .OrderBy(r => r.FullName)
            .ToListAsync();

        List<ResidentDto> result = entities
            .Select(ToDto)
            .ToList();

        return result;
    }

    public async Task<ResidentDto?> GetByIdAsync(int id)
    {
        Resident? entity = await this.dbContext.Residents
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (entity == null)
        {
            return null;
        }

        ResidentDto dto = ToDto(entity);
        return dto;
    }

    public async Task<ResidentDto> CreateAsync(ResidentDto dto)
    {
        Resident entity = new Resident
        {
            ApartmentId = dto.ApartmentId,
            FullName = dto.FullName,
            Phone = dto.Phone,
            Email = dto.Email,
            IsOwner = dto.IsOwner
        };

        this.dbContext.Residents.Add(entity);
        await this.dbContext.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    public async Task<bool> UpdateAsync(int id, ResidentDto dto)
    {
        Resident? entity = await this.dbContext.Residents.FirstOrDefaultAsync(r => r.Id == id);
        if (entity == null)
        {
            return false;
        }

        entity.ApartmentId = dto.ApartmentId;
        entity.FullName = dto.FullName;
        entity.Phone = dto.Phone;
        entity.Email = dto.Email;
        entity.IsOwner = dto.IsOwner;

        await this.dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        Resident? entity = await this.dbContext.Residents.FirstOrDefaultAsync(r => r.Id == id);
        if (entity == null)
        {
            return false;
        }

        this.dbContext.Residents.Remove(entity);
        await this.dbContext.SaveChangesAsync();
        return true;
    }

    private static ResidentDto ToDto(Resident entity)
    {
        ResidentDto dto = new ResidentDto
        {
            Id = entity.Id,
            ApartmentId = entity.ApartmentId,
            ApartmentNumber = entity.Apartment?.ApartmentNumber ?? string.Empty,
            FullName = entity.FullName,
            Phone = entity.Phone,
            Email = entity.Email,
            IsOwner = entity.IsOwner
        };
        return dto;
    }
}


