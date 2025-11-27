using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;

namespace BuildingManagement.Web.Api.FeeTypes;

public interface IFeeTypesApiClient
{
    Task<IReadOnlyCollection<FeeTypeDto>> GetAllAsync();
}


