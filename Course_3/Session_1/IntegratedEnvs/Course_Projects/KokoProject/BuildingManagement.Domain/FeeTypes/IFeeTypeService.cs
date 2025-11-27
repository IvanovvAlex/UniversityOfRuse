using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;

namespace BuildingManagement.Domain.FeeTypes;

public interface IFeeTypeService
{
    Task<IReadOnlyCollection<FeeTypeDto>> GetAllAsync();

    Task<FeeTypeDto?> GetByIdAsync(int id);

    Task<FeeTypeDto> CreateAsync(FeeTypeDto dto);

    Task<bool> UpdateAsync(int id, FeeTypeDto dto);

    Task<bool> DeleteAsync(int id);
}


