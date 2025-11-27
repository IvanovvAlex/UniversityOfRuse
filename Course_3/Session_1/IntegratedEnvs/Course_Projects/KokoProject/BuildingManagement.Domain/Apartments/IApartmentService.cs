using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Apartments;

namespace BuildingManagement.Domain.Apartments;

public interface IApartmentService
{
    Task<IReadOnlyCollection<ApartmentDto>> GetAllAsync();

    Task<ApartmentDto?> GetByIdAsync(int id);

    Task<ApartmentDto> CreateAsync(ApartmentDto dto);

    Task<bool> UpdateAsync(int id, ApartmentDto dto);

    Task<bool> DeleteAsync(int id);
}


