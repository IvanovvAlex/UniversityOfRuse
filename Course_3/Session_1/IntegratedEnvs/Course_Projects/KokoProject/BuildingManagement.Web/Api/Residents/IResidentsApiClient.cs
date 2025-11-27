using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Residents;

namespace BuildingManagement.Web.Api.Residents;

public interface IResidentsApiClient
{
    Task<IReadOnlyCollection<ResidentDto>> GetAllAsync();

    Task<ResidentDto?> GetByIdAsync(int id);

    Task<ResidentDto> CreateAsync(ResidentDto dto);

    Task<bool> UpdateAsync(int id, ResidentDto dto);

    Task<bool> DeleteAsync(int id);
}


