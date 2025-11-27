using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Buildings;

namespace BuildingManagement.Web.Api.Buildings;

public interface IBuildingsApiClient
{
    Task<IReadOnlyCollection<BuildingDto>> GetAllAsync();

    Task<BuildingDto?> GetByIdAsync(int id);

    Task<BuildingDto> CreateAsync(BuildingDto dto);

    Task<bool> UpdateAsync(int id, BuildingDto dto);

    Task<bool> DeleteAsync(int id);
}


